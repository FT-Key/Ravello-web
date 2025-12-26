// ===================================================================
// components/packageDetail/sidebar/PassengerSelector.jsx
// ===================================================================

import React from "react";
import { Users } from "lucide-react";

export default function PassengerSelector({ adultos, setAdultos, ninos, setNinos }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-border-subtle">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary-blue" />
        <h3 className="font-semibold text-lg">Pasajeros</h3>
      </div>

      <div className="space-y-4">
        {/* Adultos */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Adultos</p>
            <p className="text-sm text-gray-500">13 años o más</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdultos(Math.max(1, adultos - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
              type="button"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{adultos}</span>
            <button
              onClick={() => setAdultos(adultos + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
              type="button"
            >
              +
            </button>
          </div>
        </div>

        {/* Niños */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Niños</p>
            <p className="text-sm text-gray-500">0-12 años</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNinos(Math.max(0, ninos - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
              type="button"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{ninos}</span>
            <button
              onClick={() => setNinos(ninos + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
              type="button"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
