// ===================================================================
// components/packageDetail/sidebar/PriceDisplay.jsx
// ===================================================================

import React from "react";

export default function PriceDisplay({ precioTotal, moneda, adultos, ninos }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-border-subtle">
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-2">Precio total</p>
        <p className="text-4xl font-bold text-primary-blue">
          ${precioTotal.toLocaleString()} {moneda}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          {adultos} {adultos === 1 ? 'adulto' : 'adultos'}
          {ninos > 0 && ` + ${ninos} ${ninos === 1 ? 'niño' : 'niños'}`}
        </p>
      </div>
    </div>
  );
}


