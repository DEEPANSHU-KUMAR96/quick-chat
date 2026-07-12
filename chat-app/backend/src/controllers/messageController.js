import Message from "../models/Message.js";

/**
 * GET /api/messages
 * Fetch chat history, oldest first, with a sane upper limit so the
 * initial load stays fast even after the chat has a long history.
 */
const getMessages = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);
    const messages = await Message.find().sort({
       createdAt: 1
       }).limit(limit);
    res.status(200).json({
       success: true,
        data: messages 
      });
  } catch (error) {
    console.error("[messageController] getMessages error:", error.message);
    res.status(500).json({ 
      success: false,
       error: "Failed to fetch messages"
       });
  }
};

/**
 * POST /api/messages
 * REST fallback for sending a message (in case a client can't use sockets).
 * The primary, real-time path is still the Socket.io "send_message" event
 * handled in sockets/socketHandler.js; this endpoint reuses the same
 * persistence logic so both paths stay consistent.
 */
const createMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;

    if (!sender || !text || !text.trim()) {
      return res.status(400).json({
         success: false,
          error: "sender and text are required"
         });
    }

    const message = await Message.create({
       sender: sender.trim(),
        text: text.trim() 
      });

    // Broadcast to all connected clients so REST-sent messages also show up live.
    const io = req.app.get("io");
    if (io) {
      io.emit("receive_message", message);
    }

    res.status(201).json({ 
      success: true,
       data: message 
      });
  } catch (error) {
    console.error("[messageController] createMessage error:", error.message);
    res.status(500).json({ 
      success: false,
       error: "Failed to send message" 
      });
  }
};

export { getMessages, createMessage };
