import express from "express";

import {
  submitTest,
  createSubmission,
  getUserSubmissions,
  getPendingSubmissions,
  getSubmissionById,
  evaluateSubmission,
  getAllSubmissions,
  updateSubmissionStatus,
  getLeaderboardByTest,
  evaluateQuestion,
  finishSubmission,
  getSubmissionByTest,
  saveMcqAnswer,
  uploadInterviewResult,
} from "../controllers/submission.controller.js";

import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";
// import { checkTestTime } from "../middleware/checkTestTime.js";

const router = express.Router();

// =========================
// Create Submission
// =========================
router.post(
  "/create",
  protectRoute,
  createSubmission
);

// =========================
// Submit Test (SAFEGUARD ADDED)
// =========================
router.post(
  "/:testId",
  protectRoute,
  // checkTestTime,
  submitTest
);

// =========================
// Get User Submissions
// =========================
router.get(
  "/me",
  protectRoute,
  getUserSubmissions
);

// =========================
// Pending (Admin)
// =========================
router.get(
  "/pending",
  protectRoute,
  adminRoute,
  getPendingSubmissions
);

// =========================
// Evaluate Submission (Admin)
// =========================
router.patch(
  "/evaluate/:submissionId/:questionIndex",
  protectRoute,
  adminRoute,
  evaluateSubmission
);

// =========================
// Admin History
// =========================
router.get(
  "/all",
  protectRoute,
  adminRoute,
  getAllSubmissions
);

// =========================
// Upload Interview Result (Admin)
// =========================
router.post(
  "/upload-interview",
  protectRoute,
  adminRoute,
  uploadInterviewResult
);

// =========================
// Leaderboard
// =========================
router.get(
  "/leaderboard/:testId",
  protectRoute,
  getLeaderboardByTest
);

// =========================
// Get Submission by Test
// =========================
router.get(
  "/test/:testId",
  protectRoute,
  getSubmissionByTest
);

router.patch(
  "/:submissionId/mcq/:questionIndex",
  protectRoute,
  saveMcqAnswer
);

// =========================
// Get Submission by ID
// =========================
router.get(
  "/:submissionId",
  protectRoute,
  getSubmissionById
);

// =========================
// Update Status (NO CHANGE - safe for admin/internal use)
// =========================
router.patch(
  "/:submissionId/status",
  protectRoute,
  adminRoute,
  updateSubmissionStatus
);

// =========================
// Evaluate Question (IMPORTANT - ADD CHECK)
// =========================
router.post(
  "/evaluate-question/:submissionId/:testId/:questionIndex",
  protectRoute,
  // checkTestTime,
  evaluateQuestion
);
// =========================
// Finish Submission (CRITICAL - MUST CHECK TIME)
// =========================
router.patch(
  "/:submissionId/finish",
  protectRoute,
  // checkTestTime,
  finishSubmission
);

export default router;
