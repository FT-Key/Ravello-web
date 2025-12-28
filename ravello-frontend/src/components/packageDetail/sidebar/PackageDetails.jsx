// ===================================================================
// components/packageDetail/sidebar/PackageDetails.jsx
// ===================================================================

import React from "react";
import { Clock, MapPin, Star } from "lucide-react";

export default function PackageDetails({ pkg }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-border-subtle space-y-4">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Duración</p>
          <p className="font-medium">{pkg.duracionTotal || 0} días</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Tipo</p>
          <p className="font-medium">{pkg.tipo || "Internacional"}</p>
        </div>
      </div>

      {pkg.categoria && (
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Categoría</p>
            <p className="font-medium">{pkg.categoria}</p>
          </div>
        </div>
      )}
    </div>
  );
}