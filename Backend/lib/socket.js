import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://talkify-chat-app-rho.vercel.app",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

const broadcastUserStatus = async (userId, isOnline) => {
  if (!userId) return;

  const lastSeen = isOnline ? undefined : new Date();
  if (lastSeen) {
    await User.findByIdAndUpdate(userId, { lastSeen });
  }

  io.emit("userStatusChanged", {
    userId,
    isOnline,
    lastSeen,
  });
};

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    await broadcastUserStatus(userId, true);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    if (userId) {
      delete userSocketMap[userId];
      await broadcastUserStatus(userId, false);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
