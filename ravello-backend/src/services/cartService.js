import Cart from "../models/cartModel.js";

export async function getCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export async function addItemToCart(userId, item) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(i => i.productId === item.productId);
  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    cart.items.push(item);
  }

  await cart.save();
  return cart;
}

export async function removeItemFromCart(userId, productId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Carrito no encontrado");

  cart.items = cart.items.filter(i => i.productId !== productId);
  await cart.save();

  return cart;
}

export async function clearCart(userId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Carrito no encontrado");

  cart.items = [];
  await cart.save();

  return cart;
}
