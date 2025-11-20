import { Review } from "../models/index.js";

export const getAllReviews = async (filters = {}, pagination = { page:1, limit:10 }, sort = { createdAt: -1 }) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Review.find(filters)
      .populate("paquete", "nombre")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filters)
  ]);

  console.log("Items: ", items)
  return {
    items,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getReviewById = async (id) => {
  return await Review.findById(id).populate("paquete", "nombre");
};

export const createReview = async (data) => {
  const review = new Review(data);
  return await review.save();
};

export const updateReview = async (id, data) => {
  return await Review.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};

export const moderarReview = async (id, estado) => {
  const review = await Review.findById(id);
  if (!review) return null;

  if (!["pendiente", "aprobada", "rechazada"].includes(estado)) {
    throw new Error("Estado de moderación inválido");
  }

  review.estadoModeracion = estado;
  await review.save();
  return review;
};
