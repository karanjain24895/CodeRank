import Submission from "../models/Submission.js";
import Test from "../models/Test.js";
import { reviewCode } from "../services/aiReview.service.js";

const getTestQuestions = (test) => {
  if (test.testType === "mcq") {
    return test.mcqQuestions.map((question) => ({
      questionNumber: question.questionNumber,
      questionName: question.questionText,
      questionLink: "",
      options: question.options,
      selectedOption: null,
      correctOption: question.correctOption,
      mcqMarks: 0,
      marks: question.marks,
    }));
  }

  if (!test.questionRefs?.length) {
    return test.questions;
  }

  return test.questionRefs
    .map((ref) => {
      const question = ref.questionId;

      if (!question) return null;

      return {
        questionNumber: ref.questionNumber,
        questionName: question.questionName,
        description: question.description || "",
        questionLink: question.questionLink,
        marks: question.marks,
        questionBankId: question._id,
      };
    })
    .filter(Boolean);
};

const findTestWithQuestions = (testId) =>
  Test.findById(testId).populate({
    path: "questionRefs.questionId",
    select:
      "questionName questionLink description marks folderId",
    populate: {
      path: "folderId",
      select: "name",
    },
  });

const testSummaryPopulate = {
  path: "test",
  select:
    "topicName fullMarks sourceType testType subject topicFolderIds",
  populate: {
    path: "topicFolderIds",
    select: "name",
  },
};

const hideMcqAnswersUntilFinished = (submission) => {
  const plainSubmission =
    typeof submission.toObject === "function"
      ? submission.toObject()
      : submission;

  if (plainSubmission.isFinished) return plainSubmission;

  plainSubmission.questions = plainSubmission.questions.map((question) => {
    if (question.questionType !== "mcq") return question;

    return {
      ...question,
      correctOption: null,
      mcqMarks: 0,
      isCorrect: false,
    };
  });

  return plainSubmission;
};

// Create Submission
export const createSubmission = async (req, res) => {
  try {
    const { testId } = req.body;

    // =========================
    // Fetch Test
    // =========================
    const test = await findTestWithQuestions(testId);

    if (!test) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    const now = new Date();

    // =========================
    // (OPTIONAL) time validation
    // keeps system consistent
    // =========================
    if (test.startDateTime && now < new Date(test.startDateTime)) {
      return res.status(403).json({
        message: "Test has not started yet",
      });
    }

    if (test.endDateTime && now > new Date(test.endDateTime)) {
      return res.status(403).json({
        message: "Test has already ended",
      });
    }

    // =========================
    // Prevent duplicate submission
    // =========================
    const existingSubmission = await Submission.findOne({
      user: req.user._id,
      test: testId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "Submission already exists",
      });
    }

    // =========================
    // Build questions (UNCHANGED)
    // =========================
    const testQuestions = getTestQuestions(test);

    const questions = testQuestions.map((q) => ({
      questionType: test.testType === "mcq" ? "mcq" : "coding",
      questionName: q.questionName,
      questionLink: q.questionLink || "",
      options: q.options || [],
      selectedOption: null,
      correctOption:
        typeof q.correctOption === "number" ? q.correctOption : null,
      mcqMarks: 0,
      isCorrect: false,

      submittedTimeComplexity: "",
      submittedSpaceComplexity: "",

      codingMarks: 0,
      timeComplexityMarks: 0,
      spaceComplexityMarks: 0,

      isSolved: false,
      isEvaluated: false,

      remarks: "",
    }));

    // =========================
    // TIMER LOGIC (NEW ADDITION)
    // =========================
    const startTime = new Date();

    const durationMs =
      test.testType === "mcq"
        ? test.duration * 60 * 1000
        : test.duration * 60 * 60 * 1000;

    const endTime = new Date(startTime.getTime() + durationMs);

    // =========================
    // CREATE SUBMISSION (UNCHANGED + EXTENDED)
    // =========================
    const submission = await Submission.create({
      user: req.user._id,
      test: testId,
      status: "pending",
      questions,

      // NEW FIELDS (ADDED SAFELY)
      startTime,
      endTime,
      duration: test.duration,

      isFinished: false,
      submittedAt: null,
    });

    return res.status(201).json(hideMcqAnswersUntilFinished(submission));
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Submit Test
export const submitTest =
    async (req, res) => {

        try {
            const existingSubmission =
                await Submission.findOne({
                    user: req.user._id,
                    test: req.params.testId,
                });

            if (existingSubmission) {

                return res.status(400).json({
                    message:
                        "Test already submitted",
                });
            }

            // Get Test
            const test =
                await findTestWithQuestions(
                    req.params.testId
                );

            if (!test) {

                return res.status(404).json({
                    message:
                        "Test not found",
                });
            }

            // Copy Questions
const testQuestions = getTestQuestions(test);

const questions = testQuestions.map(
  (question, index) => ({
    questionType: test.testType === "mcq" ? "mcq" : "coding",
    questionName: question.questionName,
    questionLink: question.questionLink || "",
    options: question.options || [],
    selectedOption:
      typeof req.body.questions?.[index]?.selectedOption === "number"
        ? req.body.questions[index].selectedOption
        : null,
    correctOption:
      typeof question.correctOption === "number" ? question.correctOption : null,
    mcqMarks: 0,
    isCorrect: false,

    submittedTimeComplexity:
      req.body.questions?.[index]
        ?.timeComplexity || "",

    submittedSpaceComplexity:
      req.body.questions?.[index]
        ?.spaceComplexity || "",

    isEvaluated:
      req.body.questions?.[index]
        ?.isEvaluated || false,

    codingMarks: 0,
    timeComplexityMarks: 0,
    spaceComplexityMarks: 0,
    isSolved: false,
    remarks: "",
  })
);
            // Create Submission
            const submission =
                await Submission.create({
                    user: req.user._id,

                    test: req.params.testId,

                    status: "pending",

                    questions,
                });

            res.status(201).json(
                hideMcqAnswersUntilFinished(submission)
            );

        } catch (error) {

            res.status(500).json({
                message:
                    "Internal server error",
                error: error.message,
            });
        }
    };

// Get Logged In User Submissions
export const getUserSubmissions =
    async (req, res) => {

        try {

            const submissions =
                await Submission.find({
                    user:
                        req.user._id,
                })
                    .populate(testSummaryPopulate)
                    .sort({
                        createdAt: -1,
                    });

            res.json(
                submissions.map(hideMcqAnswersUntilFinished)
            );

        } catch (error) {

            res.status(500).json({
                message:
                    "Internal server error",
                error: error.message,
            });
        }
    };

// Get Pending Submissions
export const getPendingSubmissions =
    async (req, res) => {

        try {

            const submissions =
                await Submission.find({
                    status: "pending",
                })
                    .populate("user", "username")
                    .populate(testSummaryPopulate)
                    .sort({
                        createdAt: -1,
                    });

            res.json(submissions);

        } catch (error) {

            res.status(500).json({
                message:
                    "Internal server error",
                error: error.message,
            });
        }
    };

// Get Submission By Id
export const getSubmissionById =
    async (req, res) => {

        try {

            const submissionQuery = req.user?.isAdmin
                ? { _id: req.params.submissionId }
                : {
                    _id: req.params.submissionId,
                    user: req.user._id,
                };

            const submission =
                await Submission.findOne(submissionQuery)
                    .populate("user", "username")
                    .populate(testSummaryPopulate)

            if (!submission) {

                return res.status(404).json({
                    message:
                        "Submission not found",
                });
            }

            res.json(
                hideMcqAnswersUntilFinished(submission)
            );

        } catch (error) {

            res.status(500).json({
                message:
                    "Internal server error",
                error: error.message,
            });
        }
    };

export const updateSubmissionStatus =
  async (req, res) => {

    try {

      const { submissionId } =
        req.params;

      const { isEvaluated } =
        req.body;

      // Admin can update any submission; regular users only their own
      const submissionQuery = req.user?.isAdmin
        ? { _id: submissionId }
        : { _id: submissionId, user: req.user._id };

      const submission =
        await Submission.findOne(submissionQuery);

      if (!submission) {

        return res.status(404).json({
          message:
            "Submission not found",
        });
      }

      submission.isEvaluated =
        isEvaluated;

      submission.status =
        isEvaluated
          ? "evaluated"
          : "pending";

      submission.evaluatedAt =
        isEvaluated
          ? new Date()
          : null;

          

      await submission.save();

      res.status(200).json({
        message:
          "Submission status updated",
        submission,
      });

    } catch (error) {

      res.status(500).json({
        message:
          "Internal server error",
        error: error.message,
      });
    }
  };

  

    //Evaluate Submission
export const evaluateSubmission = async (req, res) => {
  try {
    const {
      codingMarks,
      timeComplexityMarks,
      spaceComplexityMarks,
      remarks,
      isSolved,
      correctOption,
    } = req.body;

    const { submissionId, questionIndex } = req.params;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    if (!submission.questions[questionIndex]) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const question = submission.questions[questionIndex];

    if (question.questionType === "mcq") {
      if (typeof correctOption === "number") {
        question.correctOption = correctOption;
        question.isCorrect =
          question.selectedOption !== null &&
          question.selectedOption === correctOption;

        const test = await Test.findById(submission.test).select("mcqQuestions");
        const questionMarks = test?.mcqQuestions?.[questionIndex]?.marks ?? 1;

        question.mcqMarks = question.isCorrect ? questionMarks : 0;
        question.isSolved = question.isCorrect;
        question.isEvaluated = true;
      }
    } else {
      question.codingMarks = Number(codingMarks);
      question.timeComplexityMarks = Number(timeComplexityMarks);
      question.spaceComplexityMarks = Number(spaceComplexityMarks);
      question.isSolved = Boolean(isSolved);
      question.remarks = remarks;
    }

    const allEvaluated = submission.questions.every(
      (q) => {
        if (q.questionType === "mcq") return q.isEvaluated;
        return q.remarks && q.remarks.trim() !== "";
      }
    );

    if (allEvaluated) {
      submission.status = "evaluated";
    }

    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get All Submission History (Admin)
export const getAllSubmissions = async (
    req,
    res
) => {
    try {
        const submissions = await Submission.find({})
            .populate("user", "username name email")
            .populate(testSummaryPopulate)
            .sort({
                createdAt: -1,
            });
        console.log(
            JSON.stringify(submissions, null, 2)
        );
        res.json(submissions);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const getLeaderboardByTest = async (
  req,
  res
) => {

  try {

    const { testId } =
      req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    if (test.sourceType === "ai") {
      return res.status(403).json({
        message: "Leaderboard is not available for AI generated tests",
      });
    }

    const submissions =
      await Submission.find({
        test: testId,
        isEvaluated: true,
      })
        .populate(
          "user",
          "name username"
        )
        .sort({
          createdAt: 1,
        });

    const leaderboard =
      submissions
        .map(
          (
            submission
          ) => {

            const score =
              submission.questions.reduce(
                (
                  total,
                  question
                ) =>
                  total +
                  (question.mcqMarks || 0) +
                  question.codingMarks +
                  question.timeComplexityMarks +
                  question.spaceComplexityMarks,
                0
              );

            return {
              submissionId:
                submission._id,

              actualName:
                submission.user.name,

              username:
                submission.user.username,

              score,
            };
          }
        )
        .sort(
          (
            a,
            b
          ) =>
            b.score -
            a.score
        );

    res.status(200).json(
      leaderboard
    );

  } catch (error) {

    res.status(500).json({
      message:
        "Internal server error",
      error:
        error.message,
    });
  }
};




export const evaluateQuestion = async (
  req,
  res
) => {
  try {
    const {
      testId,
      questionIndex,
    } = req.params;

    const {
      solution,
      timeComplexity,
      spaceComplexity,
      marks,
    } = req.body;

    if (!solution?.trim()) {
      return res.status(400).json({
        message: "Solution is required",
      });
    }

    const test =
      await findTestWithQuestions(testId);

    if (!test) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    let submission =
      await Submission.findOne({
        user: req.user._id,
        test: testId,
      });

    // Create submission if not exists
    if (!submission) {
      submission =
        await Submission.create({
          user: req.user._id,
          test: testId,
          status: "pending",
          questions:
            getTestQuestions(test).map((q) => ({
              questionName:
                q.questionName,

              questionLink:
                q.questionLink,


              submittedTimeComplexity:
                "",

              submittedSpaceComplexity:
                "",

              codingMarks: 0,

              timeComplexityMarks: 0,

              spaceComplexityMarks: 0,

              isSolved: false,

              isEvaluated: false,

              remarks: "",
            })),
        });
    }

    const question =
      submission.questions[
        Number(questionIndex)
      ];

    if (!question) {
      return res.status(404).json({
        message:
          "Question not found",
      });
    }

    // Prevent re-evaluation
    if (question.isEvaluated) {
      return res.status(400).json({
        message:
          "Question already evaluated",
      });
    }

    // Save TC / SC entered by user
    question.submittedTimeComplexity =
      timeComplexity || "";

    question.submittedSpaceComplexity =
      spaceComplexity || "";

    // =========================
    // AI EVALUATION
    // =========================

    const testQuestion =
      getTestQuestions(test)[
        Number(questionIndex)
      ];

    const aiResult =
      await reviewCode(
        solution,
        question.questionName,
        testQuestion.description,
        timeComplexity,
        spaceComplexity,
        marks
      );

    question.codingMarks =
      parseInt(
        aiResult.codingMarks
      ) || 0;

    question.timeComplexityMarks =
      parseInt(
        aiResult.timeComplexityMarks
      ) || 0;

    question.spaceComplexityMarks =
      parseInt(
        aiResult.spaceComplexityMarks
      ) || 0;

    question.remarks =
      aiResult.remarks || "";

    question.isSolved =
      question.codingMarks > 0;

    question.isEvaluated =
      true;

    await submission.save();

    return res.status(200).json({
      message:
        "Question evaluated successfully",

      question,

      submission,
    });

  } catch (error) {

    console.error(
      "Evaluate Question Error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error",

      error:
        error.message,
    });
  }
};

export const finishSubmission =
  async (req, res) => {
    try {
      const { submissionId } =
        req.params;

      const submission =
        await Submission.findById(
          submissionId
        );

      if (!submission) {
        return res.status(404).json({
          message:
            "Submission not found",
        });
      }

      const test = await Test.findById(submission.test).select(
        "mcqQuestions testType"
      );

      submission.isFinished =
        true;

      submission.questions.forEach((question, index) => {
        if (question.questionType !== "mcq") return;

        question.isCorrect =
          question.selectedOption !== null &&
          question.selectedOption === question.correctOption;

        const questionMarks =
          test?.mcqQuestions?.[index]?.marks ?? 1;

        question.mcqMarks = question.isCorrect ? questionMarks : 0;
        question.isSolved = question.isCorrect;
        question.isEvaluated = true;
      });

      if (
        submission.questions.length &&
        submission.questions.every((question) => question.questionType === "mcq")
      ) {
        submission.isEvaluated = true;
        submission.status = "evaluated";
        submission.evaluatedAt = new Date();
      }

      submission.submittedAt =
        new Date();

      await submission.save();

      res.status(200).json({
        message:
          "Test submitted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Internal server error",
        error:
          error.message,
      });
    }
  };

  export const getSubmissionByTest = async (
  req,
  res
) => {
  try {
    const submission =
      await Submission.findOne({
        user: req.user._id,
        test: req.params.testId,
      });

    if (!submission) {
      return res.status(404).json({
        message:
          "Submission not found",
      });
    }

    res.status(200).json(
      hideMcqAnswersUntilFinished(submission)
    );
  } catch (error) {
    res.status(500).json({
      message:
        "Internal server error",
      error:
        error.message,
    });
  }
};

export const saveMcqAnswer = async (req, res) => {
  try {
    const { submissionId, questionIndex } = req.params;
    const { selectedOption } = req.body;

    if (selectedOption === null || selectedOption === undefined) {
      return res.status(400).json({
        message: "Please select a valid option",
      });
    }

    const optionIndex = Number(selectedOption);

    if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex > 3) {
      return res.status(400).json({
        message: "Please select a valid option",
      });
    }

    const submission = await Submission.findOne({
      _id: submissionId,
      user: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    if (submission.isFinished) {
      return res.status(400).json({
        message: "Submitted tests cannot be changed",
      });
    }

    const question = submission.questions[Number(questionIndex)];

    if (!question || question.questionType !== "mcq") {
      return res.status(404).json({
        message: "MCQ question not found",
      });
    }

    question.selectedOption = optionIndex;

    await submission.save();

    return res.status(200).json({
      message: "Answer saved",
      question,
      submission: hideMcqAnswersUntilFinished(submission),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const uploadInterviewResult = async (req, res) => {
  try {
    const { userId, testName, topics, questions } = req.body;

    if (!userId || !testName || !questions || !questions.length) {
      return res.status(400).json({
        message: "Missing required fields: userId, testName, and questions are required.",
      });
    }

    // Calculate full marks
    const fullMarks = questions.reduce((sum, q) => sum + Number(q.totalMarks || 0), 0);

    // Create the Test document
    // Note: createdBy is optional — admin key bypass sets req.user = { isAdmin: true } (no _id)
    const testData = {
      topicName: testName,
      testName,
      testType: "interview",
      sourceType: "interview",
      duration: 0,
      startDateTime: new Date(),
      fullMarks,
      generatedFor: userId,
      topics: topics.map((t) => ({ name: t })),
      questions: questions.map((q, idx) => ({
        questionNumber: idx + 1,
        questionName: q.questionName,
        marks: Number(q.totalMarks || 0),
        description: q.remarks || "",
      })),
    };
    if (req.user?._id) {
      testData.createdBy = req.user._id;
    }

    const test = await Test.create(testData);

    // Create the Submission document pre-evaluated
    const submissionQuestions = questions.map((q, idx) => ({
      questionType: "interview",
      questionName: q.questionName,
      codingMarks: Number(q.obtainedMarks || 0),
      timeComplexityMarks: 0,
      spaceComplexityMarks: 0,
      maxMarks: Number(q.totalMarks || 0),
      isSolved: Number(q.obtainedMarks || 0) > 0,
      isEvaluated: true,
      remarks: q.remarks || "",
    }));

    const submission = await Submission.create({
      user: userId,
      test: test._id,
      status: "evaluated",
      isEvaluated: true,
      isFinished: true,
      submittedAt: new Date(),
      evaluatedAt: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      questions: submissionQuestions,
    });

    res.status(201).json({
      message: "Interview result uploaded successfully",
      test,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload interview result",
      error: error.message,
    });
  }
};
