import mongoose from "mongoose";

/**
 * Counter Schema (for auto-increment)
 */
const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

/**
 * Coding Question Schema
 */
const codingQuestionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    problem: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    marks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Auto increment middleware
 */
codingQuestionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "codingQuestionId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.id = counter.seq;
  }
  next();
});

const CodingQuestion = mongoose.model(
  "CodingQuestion",
  codingQuestionSchema
);

export default CodingQuestion;