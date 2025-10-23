import express from "express";
import * as favoriteController from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/:userId", favoriteController.addFavorite);
router.get("/:userId", favoriteController.getFavorites);
router.delete("/:userId/:itemId", favoriteController.removeFavorite);

export default router;
