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

    // Submission Status
    status: {
      type: String,
      enum: [
        "pending",
        "evaluated",
      ],
      default: "pending",
    },

    // Whether admin finalized evaluation
    isEvaluated: {
      type: Boolean,
      default: false,
    },

    // Evaluation completion timestamp
    evaluatedAt: {
      type: Date,
      default: null,
    },

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

        // Whether this question is solved
        isSolved: {
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