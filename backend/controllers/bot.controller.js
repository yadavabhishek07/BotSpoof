import Message from "../models/message.model.js";
import mongoose from "mongoose";

// In-memory message fallback when MongoDB is disconnected (for local offline development)
const offlineMessages = [];

/**
 * GET /bot/v1/history
 * Retrieves all chat history for the logged-in user.
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      // Fetch messages from MongoDB sorted chronologically
      const messages = await Message.find({ userId }).sort({ timestamp: 1 });
      return res.status(200).json(messages);
    } else {
      // Fallback to in-memory history if DB is offline
      const userOfflineMsgs = offlineMessages.filter(
        (m) => String(m.userId) === String(userId)
      );
      return res.status(200).json(userOfflineMsgs);
    }
  } catch (err) {
    console.error("Fetch history error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /bot/v1/message
 * Handles user chat input and streams back AI completions from Groq using Server-Sent Events (SSE).
 */
export const MessageController = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const isConnected = mongoose.connection.readyState === 1;

    // 1. Save User's Message
    if (isConnected) {
      await Message.create({ userId, sender: "user", text });
    } else {
      offlineMessages.push({ userId, sender: "user", text, timestamp: new Date() });
    }

    // 2. Fetch Past Messages for Context
    let historyMessages = [];
    if (isConnected) {
      const prevMessages = await Message.find({ userId }).sort({ timestamp: 1 });
      // Build conversation history array for the model context
      historyMessages = prevMessages
        .filter((m) => m.text !== text) // Exclude the current message to avoid duplicates
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));
    }

    // 3. Configure Server-Sent Events (SSE) Streaming Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // 4. Resolve Groq Key and Model Settings
    // Prioritizes user's client-side settings key in headers, then falls back to backend env
    const groqKey = req.headers["x-groq-api-key"] || process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

    if (!groqKey) {
      const errorMsg = "⚠️ No Groq API Key found. Please add `GROQ_API_KEY` to your environment variables or paste it in the web Settings panel (bottom-left).";
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    // 5. Query Groq API with Streaming enabled
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          {
            role: "system",
            content: "You are BotSpoof, a helpful AI assistant. Always format your responses using clean markdown.",
          },
          ...historyMessages,
          { role: "user", content: text },
        ],
        temperature: 0.7,
        stream: true, // Enables SSE token streaming
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Groq API error (${response.status}): ${errText}`);
    }

    // 6. Read and Stream Chunk-by-Chunk to Frontend
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the binary stream chunk to text and append to buffer
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // Retain any incomplete lines in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const chunk = JSON.parse(dataStr);
            const token = chunk.choices?.[0]?.delta?.content;
            if (token) {
              fullResponse += token;
              // Forward the parsed token to the client in SSE format
              res.write(`data: ${JSON.stringify({ content: token })}\n\n`);
            }
          } catch {
            // Ignore incomplete or malformed JSON chunks
          }
        }
      }
    }

    // Terminate the SSE stream
    res.write("data: [DONE]\n\n");
    res.end();

    // 7. Save Assistant's Complete Response
    if (fullResponse.trim()) {
      if (isConnected) {
        await Message.create({ userId, sender: "bot", text: fullResponse });
      } else {
        offlineMessages.push({
          userId,
          sender: "bot",
          text: fullResponse,
          timestamp: new Date(),
        });
      }
    }
  } catch (err) {
    console.error("Message Controller Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      try {
        res.write(
          `data: ${JSON.stringify({ error: `⚠️ Service Error: ${err.message}` })}\n\n`
        );
        res.write("data: [DONE]\n\n");
        res.end();
      } catch {}
    }
  }
};