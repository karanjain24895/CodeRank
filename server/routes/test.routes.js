import express from "express";

import {
    createTest,
    getAllTests,
    getSingleTest,
    updateTest,
    deleteTest,
} from "../controllers/test.controller.js";

import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";

const router = express.Router();

// Create Test
router.post(
    "/create",
    // protectRoute,
    createTest
);

// Get All Tests
router.get(
    "/all",
    // protectRoute,
    getAllTests
);

// Get Single Test
router.get(
    "/:id",
    // protectRoute,
    getSingleTest
);

// Update Test
router.put(
    "/:id",
    // protectRoute,
    updateTest
);

router.delete(
  "/:testId",
//   protectRoute,
//   adminRoute,
  deleteTest
);

export default router;