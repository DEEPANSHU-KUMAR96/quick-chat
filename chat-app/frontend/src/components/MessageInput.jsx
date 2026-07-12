import { useRef, useState } from "react";
import socket from "../socket";

const TYPING_TIMEOUT_MS = 1500;

export default function MessageInput({ onSend, username }) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const stopTyping = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit("stop_typing", username);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", username);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_TIMEOUT_MS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
    clearTimeout(typingTimeoutRef.current);
    stopTyping();
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        maxLength={2000}
      />
      <button type="submit" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}
