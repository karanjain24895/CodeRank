import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {

    try {

        const {
            name,
            username,
            password,
        } = req.body;

        const userExists =
            await User.findOne({
                username
            });

        if (userExists) {

            return res.status(400).json({
                message:
                    "Username already exists",
            });
        }

        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(
                password,
                salt
            );

        const user =
            await User.create({
                name,
                username,
                password:
                    hashedPassword,
            });

        const token =
            generateToken(
                user._id
            );

        res.cookie("token", token, {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",
        });

        res.status(201).json({
            _id: user._id,
            username:
                user.username,
            role: user.role,
        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message,
        });
    }
};

export const loginUser = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        const user =
            await User.findOne({
                username
            });

        if (!user) {

            return res.status(400).json({
                message:
                    "Invalid credentials",
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message:
                    "Invalid credentials",
            });
        }

        const token =
            generateToken(
                user._id
            );

        res.cookie("token", token, {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",
        });

        res.status(200).json({
            _id: user._id,
            username:
                user.username,
            role: user.role,
        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message,
        });
    }
};

export const logoutUser = (
    req,
    res
) => {

    res.clearCookie(
        "token",
        {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",
        }
    );

    res.status(200).json({
        message:
            "Logged out successfully",
    });
};

export const getMe = async (
    req,
    res
) => {

    res.json(req.user);
};