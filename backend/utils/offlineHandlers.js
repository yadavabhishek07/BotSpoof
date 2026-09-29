/* backend/utils/offlineHandlers.js */

import { generateToken } from "./authHelpers.js";
import jwt from "jsonwebtoken";

let nextId = 1; // simple incremental ID for offline users

export const offlineRegister = (email, password, offlineUsers) => {
  const existing = offlineUsers.find(u => u.email === email);
  if (existing) {
    throw new Error("Email is already registered (offline)");
  }
  const user = { _id: String(nextId++), email, password };
  offlineUsers.push(user);
  const token = generateToken(user._id);
  return { user, token };
};

export const offlineLogin = (email, password, offlineUsers) => {
  const user = offlineUsers.find(u => u.email === email);
  if (!user) {
    throw new Error("Invalid credentials (offline)");
  }
  if (user.password !== password) {
    throw new Error("Invalid credentials (offline)");
  }
  const token = generateToken(user._id);
  return { user, token };
};

export const offlineGuestLogin = (offlineUsers) => {
  const guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  offlineUsers.push({ _id: guestId, email: null, password: null, isGuest: true });
  const token = generateToken(guestId);
  return { guestId, token };
};

export const offlineForgotPassword = (email, offlineUsers) => {
  const user = offlineUsers.find(u => u.email === email);
  if (!user) {
    throw new Error("User not found (offline)");
  }
  const resetToken = generateToken(user._id); // reuse JWT for simplicity
  user.resetToken = resetToken;
  user.resetExpires = Date.now() + 60 * 60 * 1000; // 1h
  return { resetToken };
};

export const offlineResetPassword = (token, newPassword, offlineUsers) => {
  const payload = jwt.decode(token) || {};
  const user = offlineUsers.find(u => u._id === payload.id);
  if (!user) {
    throw new Error("User not found (offline)");
  }
  if (user.resetToken !== token || Date.now() > (user.resetExpires || 0)) {
    throw new Error("Invalid or expired reset token");
  }
  user.password = newPassword;
  delete user.resetToken;
  delete user.resetExpires;
  return { message: "Password updated successfully (offline)" };
};
