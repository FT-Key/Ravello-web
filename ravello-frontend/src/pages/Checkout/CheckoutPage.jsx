import React from "react";
import { useUserStore } from "../../stores/useUserStore";

const CheckoutPage = () => {
  const cart = useUserStore((state) => state.cart);

  const handleCheckout = async () => {
    // Aquí iría la integración con Mercado Pago
    alert("Redirigiendo a Mercado Pago...");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.map(item => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
      <button className="btn-primary mt-4" onClick={handleCheckout}>Pagar con Mercado Pago</button>
    </div>
  );
};

export default CheckoutPage;
