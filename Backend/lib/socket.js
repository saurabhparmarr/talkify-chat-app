import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://talkify-chat-app-rho.vercel.app",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

export function getReceiverSocketIds(userId) {
  return userSocketMap[userId] || [];
}

const userSocketMap = {};

const emitTypingStatus = (receiverId, senderId, isTyping) => {
  if (!receiverId || !senderId) return;

  const receiverSocketIds = getReceiverSocketIds(receiverId);

  if (receiverSocketIds.length) {
    io.to(receiverSocketIds).emit(isTyping ? "typing" : "stopTyping", {
      senderId,
      receiverId,
    });
  }
};

const emitPresence = async () => {
  const onlineUsers = Object.keys(userSocketMap).filter(
    (userId) => userSocketMap[userId]?.length
  );

  const users = await User.find({}, "_id lastSeen")
    .lean({ defaults: false });
  const lastSeenByUser = users.reduce((acc, user) => {
    if (user.lastSeen) {
      acc[user._id.toString()] = user.lastSeen;
    }
    return acc;
  }, {});

  io.emit("getOnlineUsers", onlineUsers);
  io.emit("presenceUpdated", { onlineUsers, lastSeenByUser });
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = [...(userSocketMap[userId] || []), socket.id];
  }

  emitPresence();

  socket.on("typing", ({ receiverId }) => {
    if (!receiverId || !userId) return;
    emitTypingStatus(receiverId, userId, true);
  });

  socket.on("stopTyping", ({ receiverId }) => {
    if (!receiverId || !userId) return;
    emitTypingStatus(receiverId, userId, false);
  });

  socket.on("disconnect", () => {
    if (userId) {
      userSocketMap[userId] = (userSocketMap[userId] || []).filter(
        (socketId) => socketId !== socket.id
      );

      if (!userSocketMap[userId].length) {
        delete userSocketMap[userId];
      }

      emitPresence();
    }
  });
});

export { io, app, server };
