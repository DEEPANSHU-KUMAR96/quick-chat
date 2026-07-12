export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return <div className="typing-indicator placeholder" />;

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.join(", ")} are typing...`;

  return (
    <div className="typing-indicator">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      {text}
    </div>
  );
}
