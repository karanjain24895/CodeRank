import Submission from "../models/Submission.js";
import Test from "../models/Test.js";

// Create Submission
export const createSubmission = async (
    req,
    res
) => {

    try {

        const {
            testId,
        } = req.body;

        // Prevent duplicate submissions
        const existingSubmission =
            await Submission.findOne({
                user: req.user._id,
                test: testId,
            });

        if (existingSubmission) {

            return res.status(400).json({
                message:
                    "Submission already exists",
            });
        }

        const submission =
            await Submission.create({
                user: req.user._id,
                test: testId,
                status: "pending",
                questions: [],
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
            const questions = test.questions.map((question) => ({
                questionName: question.questionName,
                questionLink: question.questionLink,
                codingMarks: 0,
                timeComplexityMarks: 0,
                spaceComplexityMarks: 0,
                isSolved: false,
                remarks: "",
            }));
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
