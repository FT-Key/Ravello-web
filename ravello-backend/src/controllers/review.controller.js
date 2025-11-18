import { reviewService } from "../services/index.js";

// GET /api/review
export const getReviews = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;

    // Solo tomamos campos que existen en el modelo
    const allowedFilters = ['tipo', 'paquete', 'estadoModeracion'];
    const filters = {};

    for (const key of allowedFilters) {
      if (req.query[key] !== undefined && req.query[key] !== "") {
        filters[key] = req.query[key];
      }
    }

    // Merge con filtro de búsqueda textual (si existe)
    const mongoFilters = { ...filters, ...searchFilter };

    const data = await reviewService.getAllReviews(
      mongoFilters,
      pagination,
      queryOptions.sort
    );

    res.json(data);
  } catch (err) {
    console.error("❌ Error en getReviews:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/review/:id
export const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/review
export const createReview = async (req, res) => {
  try {
    console.log("Llega")
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/review/:id
export const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/review/:id/moderar
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

// DELETE /api/review/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await reviewService.deleteReview(req.params.id);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
