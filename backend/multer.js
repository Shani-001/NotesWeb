import multer from "multer";
import fs from "fs";

// Ensure folders exist
if (!fs.existsSync("uploads/images"))
  fs.mkdirSync("uploads/images", { recursive: true });
if (!fs.existsSync("uploads/pdfs"))
  fs.mkdirSync("uploads/pdfs", { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/images");
    } else if (file.mimetype === "application/pdf") {
      cb(null, "uploads/pdfs");
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPEG, or PDF files are allowed!"), false);
  }
};

// Multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
