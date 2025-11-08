import { reviewService } from "../services/index.js";

export const getReviews = async (req, res) => {
  try {
    const { tipo, paquete, estadoModeracion } = req.query;
    const reviews = await reviewService.getAllReviews({ tipo, paquete, estadoModeracion });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(review);
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

export const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await reviewService.deleteReview(req.params.id);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Moderar reseña (aprobar o rechazar)
export const moderarReview = async (req, res) => {
  try {
    const { estado } = req.body;
    const review = await reviewService.moderarReview(req.params.id, estado);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
