import express from "express";
import { getMessages, createMessage } from "../controllers/messageController.js";

const router = express.Router();

// GET  /api/messages  ->fetch chat history
router.get("/", getMessages);

// POST /api/messages  -> send a message (REST fallback; sockets are primary path)
router.post("/", createMessage);

export default router;
