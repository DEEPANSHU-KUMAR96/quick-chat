import { useEffect, useRef } from "react";

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** status indicator for the current user's own messages. */
function StatusTicks({ status }) {
  if (status === "read") return <span className="ticks read">✓✓</span>;
  if (status === "delivered") return <span className="ticks delivered">✓✓</span>;
  return <span className="ticks sent">✓</span>;
}

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the newest message whenever the list changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <p className="empty-state">No messages yet — say hello 👋</p>
      )}

      {messages.map((msg) => {
        const isOwn = msg.sender === currentUser;
        return (
          <div key={msg._id} className={`message-row ${isOwn ? "own" : "other"}`}>
            <div className="message-bubble">
              {!isOwn && <div className="message-sender">{msg.sender}</div>}
              <div className="message-text">{msg.text}</div>
              <div className="message-meta">
                <span className="message-time">{formatTime(msg.createdAt)}</span>
                {isOwn && <StatusTicks status={msg.status} />}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
