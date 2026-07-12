import express from "express";

import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import messageRoutes from "./routes/messageRoutes.js";
import registerSocketHandlers from "./sockets/socketHandler.js";


  const app = express();

  app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  }));

  app.use(express.json());

 
  app.use("/api/messages", messageRoutes);


  app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
  });


  app.use((err, req, res, next) => {
    console.error("[server] Unhandled error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  });

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin:"http://localhost:5173",
     methods:["GET","POST"],
     credentials:true },
  });


  app.set("io", io);

  registerSocketHandlers(io);


  process.on("SIGINT", () => {
    console.log("\nShutting down...");
    server.close(() => process.exit(0));
  });



export { app, server };