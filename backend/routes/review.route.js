import express from "express";
// import userMiddleware from "../middleware/user.middleware.js";
// import { orderData } from "../controllers/order.controller.js";
import { getReview, postReview } from "../controllers/review.controller.js";

const router = express.Router();

router.get("/",getReview);
router.post("/",postReview);

export default router;