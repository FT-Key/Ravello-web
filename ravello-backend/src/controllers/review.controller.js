import { reviewService } from "../services/index.js";

// GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await reviewService.getAll(queryOptions, searchFilter, pagination);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("❌ Error en getReviews:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/:id
export const getReviewById = async (req, res) => {
  try {
    const data = await reviewService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en getReviewById:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const data = await reviewService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en createReview:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const data = await reviewService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en updateReview:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/reviews/:id/moderar
export const moderarReview = async (req, res) => {
  try {
    const { estado } = req.body;
    const data = await reviewService.moderar(req.params.id, estado);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en moderarReview:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({ success: true, message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteReview:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};