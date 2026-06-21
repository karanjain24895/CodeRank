import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    // =====================================
    // Common Fields
    // =====================================

    testName: {
      type: String,
      trim: true,
      default: "",
    },

    sourceType: {
      type: String,
      enum: ["manual", "ai", "interview"],
      default: "manual",
    },

    testType: {
      type: String,
      enum: ["coding", "mcq", "interview"],
      default: "coding",
    },

    topics: [
      {
        name: {
          type: String,
          trim: true,
        },
      },
    ],

    subject: {
      type: String,
      trim: true,
      default: "Coding",
    },

    instructions: [
      {
        type: String,
      },
    ],

    duration: {
      type: Number,
      required: true,
    },

    startDateTime: {
      type: Date,
      required: true,
    },

    fullMarks: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    generatedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // =====================================
    // Legacy Manual Test Support
    // (Keep this unchanged for now)
    // =====================================

    topicName: {
      type: String,
      required: true,
    },

    questions: [
      {
        questionNumber: Number,

        questionName: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          default: "",
        },

        questionLink: {
          type: String,
          default: "",
        },

        marks: {
          type: Number,
          required: true,
        },
      },
    ],

    // =====================================
    // AI Generated Test Support
    // =====================================

    topicFolderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionFolder",
      },
    ],

    questionRefs: [
      {
        questionNumber: {
          type: Number,
          required: true,
        },

        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QuestionBank",
          required: true,
        },
      },
    ],

    mcqQuestions: [
      {
        questionNumber: {
          type: Number,
          required: true,
        },

        questionText: {
          type: String,
          required: true,
          trim: true,
        },

        options: [
          {
            type: String,
            required: true,
            trim: true,
          },
        ],

        correctOption: {
          type: Number,
          required: true,
          min: 0,
          max: 3,
        },

        marks: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Test", testSchema);
