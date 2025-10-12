import express from "express";

import userMiddleware from "../middleware/user.middleware.js";
import { googleLogin, login, logout, signup } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-login", googleLogin); // new route

export default router;
