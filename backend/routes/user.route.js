import express from "express";
import {
  getUserSetting,
  login,
  logout,
  purchases,
  signup,
  updateUserSetting,
} from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/purchases", userMiddleware, purchases);
router.get("/settings", userMiddleware, getUserSetting);
router.put("/settings", userMiddleware, updateUserSetting);

export default router;
