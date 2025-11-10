import { featuredPromotionsService } from '../services/index.js';

export const getActive = async (req, res) => {
  try {
    const promo = await featuredPromotionsService.getActive();
    res.json(promo || { packages: [] });
  } catch (err) {
    console.error('[FeaturedPromotions] Error en getActive:', err);
    res.status(500).json({ error: err.message });
  }
}

export const createOrReplace = async (req, res) => {
  try {
    const { packages, titulo, descripcion } = req.body;
    const promo = await featuredPromotionsService.createOrReplace({
      packages,
      titulo,
      descripcion,
    });
    res.json(promo);
  } catch (err) {
    console.error("[FeaturedPromotions] Error en createOrReplace:", err.message);
    res.status(400).json({
      error: err.message,
      code: err.code || "UNKNOWN_ERROR",
    });
  }
};

// DELETE /api/featured-promotions/:id
export const deleteById = async (req, res) => {
  try {
    await featuredPromotionsService.deleteById(req.params.id);
    res.json({ message: 'Promoción eliminada correctamente.' });
  } catch (err) {
    console.error('[FeaturedPromotions] Error en deleteById:', err);
    res.status(500).json({ error: err.message });
  }
}

