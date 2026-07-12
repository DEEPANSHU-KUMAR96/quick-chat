import { useState } from "react";


export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Username must be under 20 characters.");
      return;
    }

    setError("");
    onLogin(trimmed);
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>💬 Real-Time Chat</h1>
        <p className="login-subtitle">Pick a username to join the chat room</p>

        <input
          type="text"
          placeholder="e.g. Alex"
          value={username}
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
}
