import Submission from "../models/Submission.js";
import Test from "../models/Test.js";
import { reviewCode } from "../services/aiReview.service.js";

// Create Submission
export const createSubmission = async (req, res) => {
  try {
    const { testId } = req.body;

    // =========================
    // Fetch Test
    // =========================
    const test = await Test.findById(testId);

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
    const questions = test.questions.map((q) => ({
      questionName: q.questionName,
      questionLink: q.questionLink,
      questionDescription: q.description,

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

    const endTime = new Date(
      startTime.getTime() + test.duration * 60 * 60 * 1000
    );

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

    return res.status(201).json(submission);
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
                await Test.findById(
                    req.params.testId
                );

            if (!test) {

                return res.status(404).json({
                    message:
                        "Test not found",
                });
            }

            // Copy Questions
const questions = test.questions.map(
  (question, index) => ({
    questionName: question.questionName,
    questionLink: question.questionLink,

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
                submission
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
                    .populate(
                        "test",
                        "topicName fullMarks"
                    )
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

// Get Pending Submissions
export const getPendingSubmissions =
    async (req, res) => {

        try {

            const submissions =
                await Submission.find({
                    status: "pending",
                })
                    .populate("user", "username")
                    .populate(
                        "test",
                        "topicName fullMarks"
                    )
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

            const submission =
                await Submission.findById(
                    req.params.submissionId
                )
                    .populate("user", "username")
                    .populate(
                        "test",
                        "topicName fullMarks"
                    )

            if (!submission) {

                return res.status(404).json({
                    message:
                        "Submission not found",
                });
            }

            res.json(
                submission
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

    submission.questions[questionIndex].codingMarks = Number(codingMarks);
    submission.questions[questionIndex].timeComplexityMarks = Number(
      timeComplexityMarks
    );
    submission.questions[questionIndex].spaceComplexityMarks = Number(
      spaceComplexityMarks
    );
    submission.questions[questionIndex].isSolved = Boolean(isSolved);
    submission.questions[questionIndex].remarks = remarks;

    const allEvaluated = submission.questions.every(
      (question) => question.remarks && question.remarks.trim() !== ""
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
            .populate(
                "test",
                "topicName fullMarks"
            )
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
      await Test.findById(testId);

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
            test.questions.map((q) => ({
              questionName:
                q.questionName,

              questionLink:
                q.questionLink,

              questionDescription:
                q.description,

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

    const aiResult =
      await reviewCode(
        solution,
        question.questionName,
        question.questionDescription,
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

      submission.isFinished =
        true;

      

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
      submission
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