import express from "express";

import {
  generateAITest,
} from "../controllers/aiTest.controller.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post(
  "/generate",
  protectRoute,
  generateAITest
);

export default router;
