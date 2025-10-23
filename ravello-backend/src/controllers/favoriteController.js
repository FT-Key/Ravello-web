import * as favoriteService from "../services/favoriteService.js";

export async function addFavorite(req, res) {
  try {
    const favorite = await favoriteService.addFavorite(req.params.userId, req.body);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getFavorites(req, res) {
  try {
    const favorites = await favoriteService.getFavorites(req.params.userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeFavorite(req, res) {
  try {
    await favoriteService.removeFavorite(req.params.userId, req.params.itemId);
    res.json({ message: "Favorito eliminado" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
