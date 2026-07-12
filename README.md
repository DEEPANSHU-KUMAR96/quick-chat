# Real-Time Chat Application

A real-time chat app built with **React** (frontend) and **Node.js + Express + Socket.io + MongoDB** (backend).

# Live Demo Url: 
https://quick-chat-6meb.onrender.com

## Features

**Core**
- Send / receive messages instantly via Socket.io (no polling, no page refresh)
- Chat history persisted in MongoDB and loaded via a REST API on refresh
- Message timestamps
- Graceful handling of connect/disconnect and API/socket errors

**Bonus (all implemented)**
- Username-based login (dummy auth — no password, session kept in `localStorage`)
- Typing indicator ("Alex is typing...")
- Online / offline user status (live sidebar list)
- Message delivered ✓ / read ✓✓ status ticks
- MongoDB persistence

## Project Structure

```
chat-app/
├── backend/
|   |── src/
│   │   ├── config/db.js              # MongoDB connection
│   │   ├── models/Message.js         # Mongoose schema
│   │   ├── controllers/messageController.js
│   │   ├── routes/messageRoutes.js   # REST: GET/POST /api/messages
│   │   ├── sockets/socketHandler.js  # All Socket.io event logic
│   │   └── app.js 
│   ├── .env               # environment variables for backend
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── ChatWindow.jsx    # Core real-time logic lives here
    │   │   ├── MessageList.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── UserList.jsx
    │   │   └── TypingIndicator.jsx
    │   ├── api.js                # REST calls
    │   ├── socket.js              # Socket.io client singleton
    │   └── App.jsx
    └── .env
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - Local MongoDB running on `mongodb://127.0.0.1:27017`, **or**
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended if you don't want to install MongoDB locally)

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env if needed (see Environment Variables below)
npm run dev      # nodemon, auto-restarts on change
# or
npm start
```

The backend starts on **http://localhost:3000** by default and exposes:

| Method | Endpoint            | Description               |
|--------|---------------------|----------------------------|
| GET    | `/api/health`        | Health check               |
| GET    | `/api/messages`      | Fetch chat history          |
| POST   | `/api/messages`      | Send a message (REST fallback) |

Socket.io runs on the same HTTP server/port.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm run dev
```

Open **http://localhost:5173**, enter a username, and start chatting. Open the same URL in a second browser tab/window (or incognito) with a different username to see real-time messaging, typing indicators, and online status in action.

## Environment Variables

**backend/.env**
| Variable        | Description                              | Example                                      |
|-----------------|-------------------------------------------|-----------------------------------------------|
| `PORT`          | Port the Express/Socket.io server runs on | `3000`                                        |
| `MONGO_URI`     | MongoDB connection string                  | `mongodb://127.0.0.1:27017/chat-app`          |
| `CLIENT_ORIGIN` | Frontend URL, used for CORS                | `http://localhost:5173`                       |

**frontend/.env**
| Variable          | Description                       | Example                  |
|-------------------|------------------------------------|--------------------------|
| `VITE_SERVER_URL` | Backend base URL (REST + sockets) | `http://localhost:3000`  |

## Design Decisions

- **Socket.io as the primary channel, REST as a fallback**: messages are sent over the socket (`send_message` event) for instant delivery. A REST `POST /api/messages` endpoint also exists per the requirements and reuses the same persistence path, broadcasting through the same `io` instance so both paths stay consistent.
- **Single global chat room**: all users are in one shared room (no 1:1 DMs), matching the assignment scope. `readBy` / `deliveredTo` are stored as arrays on each message so read/delivered status still makes sense with multiple simultaneous users.
- **Dummy auth via localStorage**: no password or user table — a username is chosen once and persisted client-side, matching the "dummy authentication" bonus requirement without over-engineering a real auth system.
- **Online presence kept in-memory** (`Map` of `socket.id -> username`) on the server rather than in MongoDB, since presence is inherently ephemeral/live and tied to active socket connections, not chat history.
- **Vite + plain React** (not Create React App) for a faster, lighter dev setup; React Native was not used since the task explicitly said React was acceptable and a web app is easier to run/verify without emulator/APK tooling.
- **Mongoose `timestamps: true`** on the Message model provides `createdAt` for free, used as the display timestamp.

## Assumptions

- A single shared chat room is sufficient (no private/direct messaging between specific user pairs).
- "Dummy authentication" means username-only login with no password or verification, as explicitly allowed by the bonus requirements.
- Message history has no pagination requirement beyond a reasonable cap (`limit` query param on `GET /api/messages`, default 200, max 500) — sufficient for a demo/assignment chat app.
- Typing indicator timeout of 1.5s of inactivity is an acceptable UX default.
- Read/delivered status is tracked per-message per-user (`deliveredTo` / `readBy` arrays) since it's a group chat, not 1:1.

## Deployment (optional)

To deploy the backend (e.g. on Render or Railway):
1. Push this repo to GitHub.
2. Create a new Web Service, point it at the `backend/` folder.
3. Set build command `npm install`, start command `npm start`.
4. Add environment variables `MONGO_URI` (e.g. a MongoDB Atlas connection string) and `CLIENT_ORIGIN` (your deployed frontend URL).
5. Update the frontend's `VITE_SERVER_URL` to the deployed backend URL and redeploy/rebuild the frontend (e.g. on Vercel/Netlify).

## Testing Notes

- Both `backend` and `frontend` were installed and built/syntax-checked successfully in the development environment.
- Full end-to-end run requires a reachable MongoDB instance (local or Atlas) — the sandbox used to prepare this project had no outbound access to MongoDB's binary download servers, so live runtime testing should be done in your own environment following the setup steps above.
