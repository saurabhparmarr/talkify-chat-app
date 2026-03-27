import express from "express";
import { getUsers, sendMessage, getMessages } from "../controllers/message.controller.js";
import isAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", isAuth, getUsers);
router.post("/send/:receiverId", isAuth, sendMessage);
router.get("/:receiverId", isAuth, getMessages);

export default router;