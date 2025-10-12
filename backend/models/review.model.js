import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  name: {
    type: String,
  },
  rating: {
    type: Number,
  },
  review: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.model("Review", reviewSchema);
