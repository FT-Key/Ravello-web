import { Review } from "../models/index.js";

export const getAllReviews = async (filter = {}) => {
  const query = {};

  if (filter.tipo) query.tipo = filter.tipo;
  if (filter.paquete) query.paquete = filter.paquete;
  if (filter.estadoModeracion) query.estadoModeracion = filter.estadoModeracion;

  return await Review.find(query)
    .populate("paquete", "nombre")
    .sort({ createdAt: -1 });
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

// ✅ Aprobar o rechazar reseña
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
