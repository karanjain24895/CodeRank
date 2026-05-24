import mongoose from "mongoose";

const testSchema = new mongoose.Schema({

    topicName: {
        type: String,
        required: true,
    },

    instructions: [
        {
            type: String,
        }
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

    questions: [
        {
            questionNumber: Number,
            questionName: String,
            questionLink: String,
            marks: Number,
            // platform: String,
            // difficulty: String,
        }
    ],

}, {
    timestamps: true,
});

export default mongoose.model("Test", testSchema);