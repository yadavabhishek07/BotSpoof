import express from "express";
import { MessageController, getHistory } from "../controllers/bot.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth); // Protect all bot routes

router.get("/history", getHistory);
router.post("/message", MessageController);

export default router;