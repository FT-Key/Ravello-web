import React from "react";
import { useUserStore } from "../../stores/useUserStore";
import { Link } from "react-router-dom";

const CartPage = () => {
  const cart = useUserStore((state) => state.cart);
  const removeFromCart = useUserStore((state) => state.removeFromCart);

  if (!cart.length) return <p>Tu carrito está vacío.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.name}</span>
          <span>${item.price}</span>
          <button className="btn-red" onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
      <Link to="/checkout" className="btn-primary mt-4 inline-block">Ir a pagar</Link>
    </div>
  );
};

export default CartPage;
