// ===================================================================
// components/packageDetail/sidebar/PaymentButtons.jsx
// ===================================================================

import React from "react";
import { CreditCard, ExternalLink } from "lucide-react";

export default function PaymentButtons({ onSelectCheckout, onSelectBrick, disabled, canBook }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 text-center">
        Elige tu método de pago
      </p>
      
      {/* MercadoPago Checkout Pro (Redirect) */}
      <button
        onClick={onSelectCheckout}
        disabled={disabled}
        className="w-full bg-[#009ee3] text-white py-3 px-4 rounded-lg hover:bg-[#0082bf] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ExternalLink className="w-5 h-5" />
        {canBook ? "Pagar con MercadoPago" : "Completar Perfil y Pagar"}
      </button>

      {/* MercadoPago Bricks (Inline) */}
      <button
        onClick={onSelectBrick}
        disabled={disabled}
        className="w-full bg-white border-2 border-[#009ee3] text-[#009ee3] py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Pagar con Tarjeta Aquí
      </button>

      <p className="text-xs text-gray-500 text-center">
        Ambas opciones son procesadas de forma segura por MercadoPago
      </p>
    </div>
  );
}

