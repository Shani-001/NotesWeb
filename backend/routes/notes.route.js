import express from "express";
import {
  buyNotes,
  createNotes,
  deleteNotes,
  getAllNotes,
  notesDetail,
  updateNotes,
  // webhook,
} from "../controllers/notes.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
// import { upload } from "../multer.js";
import { upload } from "../middleware/multer.middleware.js";

// import bodyParser from "body-parser";
// import nodemailer from "nodemailer";
// import multer from "multer";
// import fs from "fs";

const router = express.Router();
// Routes
router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "notesPdf", maxCount: 1 },
  ]),
  adminMiddleware,
  createNotes
);
router.put(
  "/update/:notesId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "notesPdf", maxCount: 1 },
  ]),
  adminMiddleware,
  updateNotes
);
router.delete("/delete/:notesId", adminMiddleware, deleteNotes);
router.get("/notes", getAllNotes);
router.get("/notes/:notesId", notesDetail);
router.post("/buy/:notesId", userMiddleware, buyNotes);
// router.post("/webhook",bodyParser.raw({ type: "application/json" }), userMiddleware,webhook);


export default router;
