# 💬 Quick Chat - Real-Time Chat Application

A modern real-time chat application built using the **MERN ecosystem** with **Socket.IO** for instant messaging. The application enables users to communicate in real time while providing a smooth and responsive chat experience with features like online status, typing indicators, message delivery/read receipts, and persistent chat history.

## 🚀 Live Demo

🔗 https://quick-chat-6meb.onrender.com

---

# ✨ Features

* 🔐 Username-based login (Dummy Authentication)
* 💬 Real-time messaging using Socket.IO
* 📜 Persistent chat history with MongoDB
* 🟢 Live online/offline user status
* ⌨️ Real-time typing indicator
* ✅ Message delivery & read receipts
* 🕒 Message timestamps
* 📱 Responsive user interface
* ⚡ Fast and seamless communication without page refresh
* 🔄 REST API fallback for message handling
* 🛡️ Error handling for API and Socket connections

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose

---

# 📂 Project Structure

```text
Quick-Chat/
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── sockets
│   │   └── app.js
│   ├── server.js
│   └── .env
│
└── frontend
    ├── src
    │   ├── components
    │   ├── api.js
    │   ├── socket.js
    │   └── App.jsx
    └── .env
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <repository-url>

cd Quick-Chat
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Create a `.env` file inside the backend folder.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

CLIENT_ORIGIN=http://localhost:5173
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Create a `.env` file inside the frontend folder.

```env
VITE_SERVER_URL=http://localhost:3000
```

---

# 📡 API Endpoints

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/api/messages` | Get all chat messages |
| POST   | `/api/messages` | Send a new message    |

---

# 🔌 Socket Events

### Client → Server

* `user_join`
* `send_message`
* `typing`
* `stop_typing`
* `message_delivered`
* `message_read`

### Server → Client

* `receive_message`
* `typing`
* `stop_typing`
* `online_users`
* `user_status`
* `message_status_update`

---

# 📸 Application Highlights

* Real-time communication without polling
* Messages are stored in MongoDB
* Online users update instantly
* Typing indicator improves chat experience
* Read and delivered message status
* Clean and responsive interface
* Built with scalable Socket.IO architecture

---

# 💡 What I Learned

While building this project, I gained practical experience with:

* Building real-time applications using Socket.IO
* Managing WebSocket connections
* Integrating REST APIs with real-time communication
* MongoDB data persistence with Mongoose
* Event-driven architecture
* State management in React
* Error handling and application structure

---

# 👨‍💻 Author

**Deepanshu Kumar**

* MERN Stack Developer
* Passionate about building scalable full-stack applications

GitHub: https://github.com/DEEPANSHU-KUMAR96

LinkedIn: https://www.linkedin.com/in/deepanshu-kumar-7523712b9

---

⭐ If you found this project helpful, consider giving it a star.
