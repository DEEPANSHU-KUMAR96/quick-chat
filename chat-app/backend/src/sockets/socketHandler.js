import Message from "../models/Message.js";

const onlineUsers = new Map();


function getOnlineUsernames() {
  return [...new Set(onlineUsers.values())].sort();
}

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
     console.log("Socket.IO is connected");
    console.log(`[socket] connected: ${socket.id}`);

    // ---- User joins with a (dummy-auth) username ----
    socket.on("user_join", (username) => {
      if (!username || typeof username !== "string") return;

      onlineUsers.set(socket.id, username.trim());
      socket.data.username = username.trim();

      // Let everyone know who's online now.
      io.emit("online_users", getOnlineUsernames());
      socket.broadcast.emit("user_status", {
        username: socket.data.username,
        status: "online",
      });
    });

    // ---- New chat message ----
    socket.on("send_message", async (payload, ack) => {
      try {
        const sender = (payload?.sender || socket.data.username || "Anonymous").trim();
        const text = (payload?.text || "").trim();

        if (!text) {
          if (typeof ack === "function") ack({ success: false, error: "Message text is empty" });
          return;
        }

        const message = await Message.create({ sender, text });

        // Broadcast to everyone (including sender, so all clients render from one source of truth).
        io.emit("receive_message", message);

        if (typeof ack === "function") ack({ success: true, data: message });
      } catch (error) {
        console.error("[socket] send_message error:", error.message);
        if (typeof ack === "function") ack({ success: false, error: "Failed to send message" });
      }
    });

    // ---- Typing indicator ----
    socket.on("typing", (username) => {
      socket.broadcast.emit("typing", { username: username || socket.data.username });
    });

    socket.on("stop_typing", (username) => {
      socket.broadcast.emit("stop_typing", { username: username || socket.data.username });
    });


    socket.on("message_delivered", async ({ messageId, username }) => {
      try {
        if (!messageId || !username) return;
        const message = await Message.findByIdAndUpdate(
          messageId,
          {
            $addToSet: { deliveredTo: username },
            $set: { status: "delivered" },
          },
          { new: true }
        );
        if (message) io.emit("message_status_update", message);
      } catch (error) {
        console.error("[socket] message_delivered error:", error.message);
      }
    });

    socket.on("message_read", async ({ messageId, username }) => {
      try {
        if (!messageId || !username) return;
        const message = await Message.findByIdAndUpdate(
          messageId,
          {
            $addToSet: { readBy: username, deliveredTo: username },
            $set: { status: "read" },
          },
          { new: true }
        );
        if (message) io.emit("message_status_update", message);
      } catch (error) {
        console.error("[socket] message_read error:", error.message);
      }
    });

    // ---- Disconnect ----
    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);

      console.log(`[socket] disconnected: ${socket.id} (${username || "unknown"})`);

      io.emit("online_users", getOnlineUsernames());
      if (username) {
        socket.broadcast.emit("user_status", { username, status: "offline" });
      }
    });
  });
}

export default registerSocketHandlers;
