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
} from "../controllers/submission.controller.js";


import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";

const router = express.Router();

// Create Submission
router.post(
    "/create",
    protectRoute,
    createSubmission
);

// Submit Test
router.post(
    "/:testId",
    protectRoute,
    submitTest
);

// Get Logged In User Submissions
router.get(
    "/me",
    protectRoute,
    getUserSubmissions
);

// Get Pending Submissions (Admin)
router.get(
    "/pending",
    protectRoute,
    adminRoute,
    getPendingSubmissions
);

// router.get(
//     "/:id",
//     protectRoute,
//     getSubmissionById
// );

router.patch(
    "/evaluate/:submissionId/:questionIndex",
    protectRoute,
    adminRoute,
    evaluateSubmission
);

// Admin Submission History
router.get(
"/all",
protectRoute,
adminRoute,
getAllSubmissions
);

router.get(
  "/leaderboard/:testId",
  protectRoute,
  getLeaderboardByTest
);

router.get(
    "/:submissionId",
    protectRoute,
    getSubmissionById
);

router.patch(
  "/:submissionId/status",
  updateSubmissionStatus
);



export default router;