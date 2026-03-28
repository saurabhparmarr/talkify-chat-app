// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app } from "./lib/socket.js";
import { server } from "./lib/socket.js";
import dotenv from "dotenv";
dotenv.config();

// PORT setup
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ---------- CORS Setup ----------
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://talkify-chat-app-rho.vercel.app" // production
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // mobile apps / curl requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy: This origin is not allowed.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ---------- Middleware ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// ---------- Test Route ----------
app.get("/", (req, res) => {
  res.send("Hello from Talkify Backend!");
});

// ---------- API Routes ----------
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ---------- Start Server ----------
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});