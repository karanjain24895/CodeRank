import express from "express";

import {
  createQuestion,
  getQuestionsByFolder,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionBank.controller.js";

const router = express.Router();

router.post("/", createQuestion);

router.get(
  "/folder/:folderId",
  getQuestionsByFolder
);

router.put("/:id", updateQuestion);

router.delete("/:id", deleteQuestion);

export default router;