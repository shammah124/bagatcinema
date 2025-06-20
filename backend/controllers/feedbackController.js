// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";

export const getUserFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id }).select(
      "-userId"
    );
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { movieId, rating, review } = req.body;

    if (!movieId || typeof rating !== "number") {
      return res
        .status(400)
        .json({ message: "Movie ID and rating are required." });
    }

    const existing = await Feedback.findOne({ userId: req.user.id, movieId });

    if (existing) {
      existing.rating = rating;
      existing.review = review;
      await existing.save();
      return res.json(existing);
    }

    const newFeedback = await Feedback.create({
      userId: req.user.id,
      movieId,
      rating,
      review,
    });

    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback." });
  }
};

export const removeFeedback = async (req, res) => {
  try {
    const { movieId } = req.params;
    const removed = await Feedback.findOneAndDelete({
      userId: req.user.id,
      movieId,
    });

    if (!removed)
      return res.status(404).json({ message: "Feedback not found." });

    res.json({ message: "Feedback removed." });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove feedback." });
  }
};
