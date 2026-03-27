import express from "express";
import { signup, login,logout, updateProfile } from "../controllers/user.controller.js";
import isAuth from "../middlewares/auth.middleware.js";
import { checkAuth } from "../controllers/user.controller.js"; 

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout)
router.put("/update-profile",isAuth, updateProfile);
router.get("/check",isAuth, checkAuth);

export default router;