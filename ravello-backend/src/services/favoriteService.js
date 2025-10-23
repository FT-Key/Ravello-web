import Favorite from "../models/favoriteModel.js";

export async function addFavorite(userId, { itemId, itemType, itemName }) {
  const exists = await Favorite.findOne({ user: userId, itemId });
  if (exists) throw new Error("Este elemento ya está en favoritos");

  const favorite = await Favorite.create({ user: userId, itemId, itemType, itemName });
  return favorite;
}

export async function getFavorites(userId) {
  return await Favorite.find({ user: userId });
}

export async function removeFavorite(userId, itemId) {
  const favorite = await Favorite.findOneAndDelete({ user: userId, itemId });
  if (!favorite) throw new Error("Favorito no encontrado");
  return true;
}
