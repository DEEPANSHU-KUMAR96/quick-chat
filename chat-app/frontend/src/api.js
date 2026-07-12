const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/** Fetch chat history via the REST API (used on initial load / refresh). */
export async function fetchMessages() {
  const res = await fetch(`${SERVER_URL}/api/messages`);
  if (!res.ok) throw new Error(`Failed to fetch messages (${res.status})`);
  const json = await res.json();
  return json.data;
}

/**
 * REST fallback for sending a message. The app primarily sends messages
 * over the socket connection (see ChatWindow), but this stays available
 * as a fallback / for non-socket clients, per the assignment's REST API
 * requirement.
 */
export async function sendMessageREST(sender, text) {
  const res = await fetch(`${SERVER_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, text }),
  });
  if (!res.ok) throw new Error(`Failed to send message (${res.status})`);
  const json = await res.json();
  return json.data;
}
