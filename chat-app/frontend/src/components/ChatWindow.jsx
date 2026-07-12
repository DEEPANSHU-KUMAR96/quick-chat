import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { fetchMessages } from "../api";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserList from "./UserList";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connectionError, setConnectionError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);

 
  const readIdsRef = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const history = await fetchMessages();
        if (isMounted) setMessages(history);
      } catch (err) {
        console.error(err);
        if (isMounted) setConnectionError("Could not load chat history from the server.");
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    })();

    socket.connect();
    socket.emit("user_join", username);

    const handleConnectError = () => {
      setConnectionError("Could not connect to the chat server. Retrying...");
    };
    const handleConnect = () => setConnectionError("");

    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        // Avoid duplicating a message we already have 
        if (prev.some((m) => m._id === message._id)) {
          return prev.map((m) => (m._id === message._id ? message : m));
        }
        return [...prev, message];
      });

      // Tell the sender we've received this message in real time.
      if (message.sender !== username) {
        socket.emit("message_delivered", { messageId: message._id, username });
      }
    };

    const handleStatusUpdate = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    };

    const handleOnlineUsers = (users) => setOnlineUsers(users);

    const handleTyping = ({ username: typer }) => {
      if (typer === username) return;
      setTypingUsers((prev) => (prev.includes(typer) ? prev : [...prev, typer]));
    };

    const handleStopTyping = ({ username: typer }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== typer));
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_status_update", handleStatusUpdate);
    socket.on("online_users", handleOnlineUsers);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      isMounted = false;
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_status_update", handleStatusUpdate);
      socket.off("online_users", handleOnlineUsers);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.disconnect();
    };
    
  }, [username]);

  useEffect(() => {
    if (document.visibilityState !== "visible") return;

    messages.forEach((msg) => {
      const alreadyMarked = readIdsRef.current.has(msg._id);
      const isOwnMessage = msg.sender === username;
      const alreadyRead = msg.readBy?.includes(username);

      if (!alreadyMarked && !isOwnMessage && !alreadyRead) {
        readIdsRef.current.add(msg._id);
        socket.emit("message_read", { messageId: msg._id, username });
      }
    });
  }, [messages, username]);

  const handleSend = (text) => {
    socket.emit("send_message", { sender: username, text }, (response) => {
      if (!response?.success) {
        setConnectionError(response?.error || "Failed to send message.");
      }
    });
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <h2>💬 Real-Time Chat</h2>
        <div className="chat-header-right">
          <span>
            Signed in as <strong>{username}</strong>
          </span>
          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      {connectionError && <div className="banner error-banner">{connectionError}</div>}

      <div className="chat-body">
        <UserList onlineUsers={onlineUsers} currentUser={username} />

        <main className="chat-main">
          {loadingHistory ? (
            <p className="empty-state">Loading messages...</p>
          ) : (
            <MessageList messages={messages} currentUser={username} />
          )}
          <TypingIndicator typingUsers={typingUsers} />
          <MessageInput onSend={handleSend} username={username} />
        </main>
      </div>
    </div>
  );
}
