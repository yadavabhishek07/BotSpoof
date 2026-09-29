import express from "express";
import { login, register, guestLogin, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/guest", guestLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
