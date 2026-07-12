import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// autoConnect is false so the App can control exactly when the socket
// connects (i.e. only after the user "logs in" with a username).
export const socket = io(SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
});

export default socket;
