import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

dotenv.config();

const app = express();

// app.use(cors({
//     origin: [
//         process.env.CLIENT_URL,
//         process.env.ADMIN_URL
//     ],
//     credentials: true,
// }));

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected ✅");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log(err);
});