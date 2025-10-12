import { Review } from "../models/review.model.js";

export const getReview = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    console.log(reviews);
    res.status(201).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const postReview = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, rating, review } = req.body;
    // console.log(name, rating, review);
    const newReview = new Review({ name, rating, review });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
