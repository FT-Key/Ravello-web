import { reviewService } from '../services/index.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const hideReview = async (req, res) => {
  try {
    const review = await reviewService.hideReview(req.params.id);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({ message: 'Review eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
