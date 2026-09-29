// utils/authHelpers.js

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const offlineUsers = [];
export const isDbConnected = () => mongoose.connection.readyState === 1;
export const getJwtSecret = () => process.env.JWT_SECRET || "fallback_super_secret_key";
export const generateToken = (userId) => jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: "7d" });
