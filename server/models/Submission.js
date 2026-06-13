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
      type: Number, // coding: hours, MCQ: minutes
      default: null,
    },

    // =========================
    // QUESTIONS
    // =========================
    questions: [
      {
        questionType: {
          type: String,
          enum: ["coding", "mcq"],
          default: "coding",
        },

        questionName: {
          type: String,
          required: true,
        },

        questionLink: {
          type: String,
          default: "",
        },

        options: [
          {
            type: String,
            trim: true,
          },
        ],

        selectedOption: {
          type: Number,
          default: null,
          min: 0,
          max: 3,
        },

        correctOption: {
          type: Number,
          default: null,
          min: 0,
          max: 3,
        },

        mcqMarks: {
          type: Number,
          default: 0,
          min: 0,
        },

        isCorrect: {
          type: Boolean,
          default: false,
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
        (question.mcqMarks || 0) +
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
