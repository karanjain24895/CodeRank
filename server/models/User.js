import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },

}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);