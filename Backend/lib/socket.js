import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://talkify-chat-app-rho.vercel.app",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  return /https:\/\/.*\.vercel\.app$/i.test(origin) || /http:\/\/localhost(:\d+)?$/i.test(origin) || /http:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin);
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("CORS policy: This origin is not allowed."), false);
    },
    methods: ["GET", "POST"],
    credentials: true,
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
  try {
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
  } catch (error) {
    console.error("Failed to emit presence update", error);
  }
};

io.on("connection", (socket) => {
  const rawUserId = socket.handshake.query.userId;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

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
