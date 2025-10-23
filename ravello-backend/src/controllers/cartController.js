import * as cartService from "../services/cartService.js";

export async function getCart(req, res) {
  try {
    const cart = await cartService.getCart(req.params.userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addItem(req, res) {
  try {
    const cart = await cartService.addItemToCart(req.params.userId, req.body);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function removeItem(req, res) {
  try {
    const cart = await cartService.removeItemFromCart(req.params.userId, req.params.productId);
    res.json(cart);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    const cart = await cartService.clearCart(req.params.userId);
    res.json(cart);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
