import Test from "../models/Test.js";
import QuestionBank from "../models/QuestionBank.js";
import {
  buildBalancedSelection,
  generateMcqQuestions,
  selectQuestionsForTest,
} from "../services/aiTest.service.js";
import {
  AI_CODING_TEST_DURATIONS,
  CODING_SUBJECT,
  MCQ_SUBJECTS,
  VALID_CODING_QUESTION_COUNTS,
  VALID_MCQ_QUESTION_COUNTS,
} from "../constants/aiTest.constants.js";

export const generateAITest = async (req, res) => {
  try {
    const {
      testName,
      testType = "coding",
      subject = CODING_SUBJECT,
      topicFolderIds,
      questionCount,
    } = req.body;
    const normalizedQuestionCount = Number(questionCount);
    const normalizedTestType =
      testType === "mcq" ? "mcq" : "coding";

    // Validation

    if (!testName) {
      return res.status(400).json({
        message: "Test name is required",
      });
    }

    const validQuestionCounts =
      normalizedTestType === "mcq"
        ? VALID_MCQ_QUESTION_COUNTS
        : VALID_CODING_QUESTION_COUNTS;

    if (!validQuestionCounts.includes(normalizedQuestionCount)) {
      return res.status(400).json({
        message:
          normalizedTestType === "mcq"
            ? "MCQ question count must be 10, 20 or 30"
            : "Coding question count must be 5, 10 or 12",
      });
    }

    if (normalizedTestType === "coding" && (
      !Array.isArray(topicFolderIds) ||
      topicFolderIds.length === 0
    )) {
      return res.status(400).json({
        message: "At least one coding topic is required",
      });
    }

    if (
      normalizedTestType === "coding" &&
      topicFolderIds.length > 5
    ) {
      return res.status(400).json({
        message:
          "You can select a maximum of 5 topics",
      });
    }

    if (
      normalizedTestType === "mcq" &&
      !MCQ_SUBJECTS.includes(subject)
    ) {
      return res.status(400).json({
        message: "Please select a valid MCQ topic",
      });
    }

    if (normalizedTestType === "mcq") {
      const mcqQuestions = await generateMcqQuestions(
        subject,
        normalizedQuestionCount
      );

      const duration = normalizedQuestionCount;

      const test = await Test.create({
        testName,
        sourceType: "ai",
        testType: "mcq",
        subject,
        topicName: testName,
        instructions: [
          "Answer every multiple-choice question.",
          "Each question has exactly one correct option.",
          "Click Save and Next to store your answer before moving ahead.",
        ],
        duration,
        startDateTime: new Date(),
        fullMarks: mcqQuestions.reduce(
          (sum, question) => sum + question.marks,
          0
        ),
        createdBy: req.user?._id || null,
        generatedFor: req.user?._id || null,
        mcqQuestions,
      });

      return res.status(201).json({
        success: true,
        test,
      });
    }

    // Fetch questions from selected folders

    const questions =
      await QuestionBank.find({
        folderId: {
          $in: topicFolderIds,
        },
      }).populate("folderId", "name");

    if (
      questions.length <
      normalizedQuestionCount
    ) {
      return res.status(400).json({
        message:
          "Not enough questions available in selected topics",
      });
    }

    let selectedQuestions;

    try {
      selectedQuestions =
        await selectQuestionsForTest(
          questions,
          normalizedQuestionCount
        );
    } catch (aiError) {
      console.error(
        "AI question selection failed:",
        aiError.response?.data || aiError.message
      );

      selectedQuestions =
        buildBalancedSelection(
          questions,
          normalizedQuestionCount
        );
    }

    const fullMarks =
      selectedQuestions.reduce(
        (sum, q) => sum + q.marks,
        0
      );

    const duration =
      AI_CODING_TEST_DURATIONS[normalizedQuestionCount];

    const test =
      await Test.create({
        testName,

        sourceType: "ai",
        testType: "coding",
        subject: CODING_SUBJECT,

        topicName: testName,

        topicFolderIds,

        instructions: [
          "Solve every question using the linked problem statement.",
          "Submit your solution, time complexity and space complexity for each question.",
          "Each question can be evaluated once.",
        ],

        duration,

        startDateTime: new Date(),

        fullMarks,

        createdBy: req.user?._id || null,

        generatedFor: req.user?._id || null,

        questionRefs:
          selectedQuestions.map(
            (q, index) => ({
              questionNumber:
                index + 1,
              questionId: q._id,
            })
          ),
      });

    return res.status(201).json({
      success: true,
      test,
    });
  } catch (error) {
    const status = error.response?.status;

    console.log("generateAITest error", {
      status,
      message: error.message,
      response: error.response?.data,
    });

    if (status === 429) {
      return res.status(429).json({
        message:
          "AI generation is temporarily rate limited. Please try again in a minute.",
      });
    }

    return res.status(500).json({
      message:
        "Failed to generate AI test",
    });
  }
};
