import { useState } from "react";
import Login from "./components/Login";
import ChatWindow from "./components/ChatWindow";

const STORAGE_KEY = "chat-app-username";

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

  const handleLogin = (name) => {
    localStorage.setItem(STORAGE_KEY, name);
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsername("");
  };

  return username ? (
    <ChatWindow username={username} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
