import express from "express";

import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
} from "../controllers/questionFolder.controller.js";


const router = express.Router();

router.post("/", createFolder);

router.get("/", getFolders);

router.put("/:id", updateFolder);

router.delete("/:id", deleteFolder);

export default router;