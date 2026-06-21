import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    getAllUsers,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";
const router = express.Router();
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protectRoute, getMe);
router.get("/users", protectRoute, adminRoute, getAllUsers);
export default router;
