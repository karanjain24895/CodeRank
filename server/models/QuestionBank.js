import mongoose from "mongoose";

const questionBankSchema = new mongoose.Schema(
  {
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionFolder",
      required: true,
    },

    questionName: {
      type: String,
      required: true,
      trim: true,
    },

    questionLink: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "QuestionBank",
  questionBankSchema
);