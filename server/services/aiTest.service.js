import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;



const MCQ_MARKS = 10;
const MCQ_BATCH_SIZE = 10;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MAX_RETRIES = 4;
const GROQ_BATCH_DELAY_MS = 1500;

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const getRetryDelayMs = (error, attempt) => {
  const retryAfter = error.response?.headers?.["retry-after"];
  const retryAfterMs = Number(retryAfter) * 1000;

  if (Number.isFinite(retryAfterMs) && retryAfterMs > 0) {
    return retryAfterMs;
  }

  return Math.min(30000, 1000 * 2 ** (attempt - 1));
};

const isRetryableGroqError = (error) => {
  const status = error.response?.status;

  return status === 429 || (status >= 500 && status < 600);
};

const postGroqChatCompletion = async (payload) => {
  let lastError;

  for (let attempt = 1; attempt <= GROQ_MAX_RETRIES; attempt += 1) {
    try {
      return await axios.post(GROQ_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 90000,
      });
    } catch (error) {
      lastError = error;

      if (!isRetryableGroqError(error) || attempt === GROQ_MAX_RETRIES) {
        throw error;
      }

      const delayMs = getRetryDelayMs(error, attempt);
      console.warn(
        `Groq request limited/failed with status ${error.response?.status}; retrying in ${Math.round(delayMs / 1000)}s`
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
};

const extractJsonArray = (value = "") => {
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.questions)) return parsed.questions;
  } catch {
    // Fall through to extracting JSON from text-wrapped model output.
  }

  const objectMatch = value.match(/\{[\s\S]*\}/);

  if (objectMatch) {
    try {
      const parsed = JSON.parse(objectMatch[0]);

      if (Array.isArray(parsed.questions)) return parsed.questions;
    } catch {
      // Fall through to array extraction.
    }
  }

  const arrayMatch = value.match(/\[[\s\S]*\]/);

  if (!arrayMatch) return [];

  try {
    return JSON.parse(arrayMatch[0]);
  } catch {
    return [];
  }
};

const getFolderId = (question) =>
  question.folderId?._id?.toString() ||
  question.folderId?.toString();

const getFolderName = (question) =>
  question.folderId?.name || "Unknown Topic";

export const buildBalancedSelection = (
  questions,
  questionCount,
  preferredIds = []
) => {
  const groups = new Map();
  const seen = new Set();
  const preferredIdSet = new Set(preferredIds);

  questions.forEach((question) => {
    const folderId = getFolderId(question);

    if (!groups.has(folderId)) {
      groups.set(folderId, []);
    }

    groups.get(folderId).push(question);
  });

  const selectedQuestions = [];
  const groupEntries = [...groups.values()];

  while (
    selectedQuestions.length < questionCount &&
    groupEntries.some((group) =>
      group.some((question) => !seen.has(question._id.toString()))
    )
  ) {
    for (const group of groupEntries) {
      if (selectedQuestions.length >= questionCount) break;

      const preferredQuestion = group.find((question) => {
        const id = question._id.toString();

        return preferredIdSet.has(id) && !seen.has(id);
      });

      const fallbackQuestion = group.find(
        (question) => !seen.has(question._id.toString())
      );

      const nextQuestion = preferredQuestion || fallbackQuestion;

      if (!nextQuestion) continue;

      selectedQuestions.push(nextQuestion);
      seen.add(nextQuestion._id.toString());
    }
  }

  return selectedQuestions;
};

export const selectQuestionsForTest = async (
  questions,
  questionCount
) => {
  if (!GROQ_API_KEY) {
    return buildBalancedSelection(questions, questionCount);
  }

  const questionList = questions.map((question) => ({
    id: question._id.toString(),
    name: question.questionName,
    topic: getFolderName(question),
  }));

  const response = await postGroqChatCompletion(
    {
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You select coding interview questions from a provided question bank. Return strict JSON only.",
        },
        {
          role: "user",
          content: `
Choose exactly ${questionCount} question IDs that are most commonly useful for coding interviews.
Balance the choices across the topic field and avoid near-duplicate patterns.

Return ONLY a JSON array of IDs, for example:
["id1", "id2"]

Questions:
${JSON.stringify(questionList)}
`,
        },
      ],
      temperature: 0.2,
    }
  );

  const content =
    response.data.choices?.[0]?.message?.content || "";

  const selectedIds = extractJsonArray(content)
    .map((id) => id.toString())
    .filter(Boolean);

  return buildBalancedSelection(
    questions,
    questionCount,
    selectedIds
  );
};

const normalizeCorrectOption = (question, options) => {
  const rawCorrectOption =
    question.correctOption ??
    question.correct_option ??
    question.answerIndex ??
    question.answer_index;

  const numericCorrectOption = Number(rawCorrectOption);

  if (
    Number.isInteger(numericCorrectOption) &&
    numericCorrectOption >= 0 &&
    numericCorrectOption <= 3
  ) {
    return numericCorrectOption;
  }

  const rawAnswer =
    question.correctAnswer ??
    question.correct_answer ??
    question.answer;

  if (typeof rawAnswer !== "string") return Number.NaN;

  const normalizedAnswer = rawAnswer.trim();
  const letterIndex = ["A", "B", "C", "D"].indexOf(
    normalizedAnswer.toUpperCase()
  );

  if (letterIndex >= 0) return letterIndex;

  return options.findIndex(
    (option) =>
      option.toLowerCase() === normalizedAnswer.toLowerCase()
  );
};

const normalizeMcqQuestions = (questions, questionCount, startNumber = 1) =>
  questions
    .map((question, index) => {
      const rawOptions = question.options || question.choices;
      const options = Array.isArray(rawOptions)
        ? rawOptions.slice(0, 4).map((option) => option?.toString().trim())
        : [];

      const correctOption = normalizeCorrectOption(question, options);

      return {
        questionNumber: startNumber + index,
        questionText:
          question.questionText?.toString().trim() ||
          question.question?.toString().trim() ||
          question.text?.toString().trim() ||
          "",
        options,
        correctOption,
        marks: MCQ_MARKS,
      };
    })
    .slice(0, questionCount)
    .filter(
      (question) =>
        question.questionText &&
        question.options.length === 4 &&
        question.options.every(Boolean) &&
        Number.isInteger(question.correctOption) &&
        question.correctOption >= 0 &&
        question.correctOption <= 3
    );

const generateMcqQuestionBatch = async (
  subject,
  questionCount,
  startNumber
) => {
  const response = await postGroqChatCompletion(
    {
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You create technical assessment MCQs. Return strict JSON only.",
        },
        {
          role: "user",
          content: `
Create exactly ${questionCount} multiple-choice questions for ${subject}.
Each question must have four plausible options and exactly one correct answer.
Use zero-based indexing for correctOption, where 0 means option A and 3 means option D.
Keep questions concise and suitable for a college placement test. The questions should be standard questions asked in placements.
Avoid repeating questions from the same obvious pattern.

Return ONLY JSON in this shape:
{
  "questions": [
    {
      "questionText": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctOption": 0
    }
  ]
}
`,
        },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    }
  );

  const content = response.data.choices?.[0]?.message?.content || "";
  return normalizeMcqQuestions(
    extractJsonArray(content),
    Number(questionCount),
    startNumber
  );
};

export const generateMcqQuestions = async (subject, questionCount) => {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is required to generate MCQ tests");
  }

  const normalizedQuestionCount = Number(questionCount);
  const batches = [];

  for (
    let remaining = normalizedQuestionCount;
    remaining > 0;
    remaining -= MCQ_BATCH_SIZE
  ) {
    batches.push(Math.min(MCQ_BATCH_SIZE, remaining));
  }

  const questions = [];

  for (const batchSize of batches) {
    const startNumber = questions.length + 1;
    let batchQuestions = [];

    for (let attempt = 1; attempt <= 2 && batchQuestions.length < batchSize; attempt += 1) {
      batchQuestions = await generateMcqQuestionBatch(
        subject,
        batchSize,
        startNumber
      );
    }

    questions.push(...batchQuestions);

    if (questions.length < normalizedQuestionCount) {
      await sleep(GROQ_BATCH_DELAY_MS);
    }
  }

  if (questions.length !== normalizedQuestionCount) {
    throw new Error(
      `AI returned ${questions.length}/${normalizedQuestionCount} valid MCQ questions`
    );
  }

  return questions.map((question, index) => ({
    ...question,
    questionNumber: index + 1,
  }));
};
