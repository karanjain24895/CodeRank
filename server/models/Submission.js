import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    // =========================
    // TEST STATUS
    // =========================
    status: {
      type: String,
      enum: ["pending", "evaluated"],
      default: "pending",
    },

    isEvaluated: {
      type: Boolean,
      default: false,
    },

    isFinished: {
      type: Boolean,
      default: false,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    evaluatedAt: {
      type: Date,
      default: null,
    },

    // =========================
    // TIMED TEST SUPPORT
    // =========================
    startTime: {
      type: Date,
      default: null,
    },

    endTime: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number, // in hours (copied from Test for reference)
      default: null,
    },

    // =========================
    // QUESTIONS
    // =========================
    questions: [
      {
        questionName: {
          type: String,
          required: true,
        },

        questionLink: {
          type: String,
          required: true,
        },

        submittedTimeComplexity: {
          type: String,
          default: "",
          trim: true,
        },

        submittedSpaceComplexity: {
          type: String,
          default: "",
          trim: true,
        },

        codingMarks: {
          type: Number,
          default: 0,
          min: 0,
        },

        timeComplexityMarks: {
          type: Number,
          default: 0,
          min: 0,
        },

        spaceComplexityMarks: {
          type: Number,
          default: 0,
          min: 0,
        },

        isSolved: {
          type: Boolean,
          default: false,
        },

        isEvaluated: {
          type: Boolean,
          default: false,
        },

        remarks: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual Total Score
submissionSchema.virtual(
  "totalScore"
).get(function () {

  return this.questions.reduce(
    (total, question) => {

      return (
        total +
        question.codingMarks +
        question.timeComplexityMarks +
        question.spaceComplexityMarks
      );
    },
    0
  );
});

// Virtual Solved Questions Count
submissionSchema.virtual(
  "solvedQuestionsCount"
).get(function () {

  return this.questions.filter(
    (question) =>
      question.isSolved
  ).length;
});

// Include virtuals in JSON response
submissionSchema.set(
  "toJSON",
  {
    virtuals: true,
  }
);

submissionSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);

export default mongoose.model(
  "Submission",
  submissionSchema
);