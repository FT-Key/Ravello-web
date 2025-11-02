import { Review } from '../models/index.js';

export const getAllReviews = async () => {
  return await Review.find({ visible: true }).sort({ createdAt: -1 });
};

export const createReview = async (data) => {
  const review = new Review(data);
  return await review.save();
};

export const hideReview = async (id) => {
  return await Review.findByIdAndUpdate(id, { visible: false }, { new: true });
};

export const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};
