// backend/controllers/auth.controller.js

import UserAccount from "../models/userAccount.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { generateToken, isDbConnected, offlineUsers } from "../utils/authHelpers.js";
import {
  offlineRegister,
  offlineLogin,
  offlineGuestLogin,
  offlineForgotPassword,
  offlineResetPassword,
} from "../utils/offlineHandlers.js";

// Register (online & offline)
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (isDbConnected()) {
      const existingUser = await UserAccount.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }
      const user = await UserAccount.create({ email, password });
      const token = generateToken(user._id);
      return res
        .status(201)
        .json({ message: "User created successfully", token, user: { id: user._id, email: user.email } });
    } else {
      const { user, token } = offlineRegister(email, password, offlineUsers);
      return res
        .status(201)
        .json({ message: "User created successfully (offline mode)", token, user: { id: user._id, email: user.email } });
    }
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login (online & offline)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (isDbConnected()) {
      const user = await UserAccount.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const token = generateToken(user._id);
      return res
        .status(200)
        .json({ message: "Login successful", token, user: { id: user._id, email: user.email } });
    } else {
        try {
            const { user, token } = offlineLogin(email, password, offlineUsers);
            return res
                .status(200)
                .json({ message: "Login successful (offline mode)", token, user: { id: user._id, email: user.email } });
        } catch (err) {
            console.error("Offline Login Error:", err);
            return res.status(400).json({ error: err.message });
        }
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Guest login (online & offline)
export const guestLogin = async (req, res) => {
  try {
    const { guestId, token } = offlineGuestLogin(offlineUsers);
    return res
      .status(200)
      .json({ message: "Guest session created", token, user: { id: guestId, guest: true } });
  } catch (error) {
    console.error("Guest Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Forgot password (online & offline)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    if (isDbConnected()) {
      const user = await UserAccount.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
      const resetToken = generateToken(user._id);
      return res.status(200).json({ message: "Reset token generated", resetToken });
    } else {
      const { resetToken } = offlineForgotPassword(email, offlineUsers);
      return res.status(200).json({ message: "Reset token generated (offline)", resetToken });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reset password (online & offline)
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token and newPassword are required" });

    if (isDbConnected()) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_super_secret_key");
      if (!decoded || !decoded.id) return res.status(400).json({ error: "Invalid reset token" });
      const user = await UserAccount.findById(decoded.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      const result = offlineResetPassword(token, newPassword, offlineUsers);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
