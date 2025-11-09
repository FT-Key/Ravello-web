// src/components/Packages/PackageCard.jsx
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import PackageTags from "../Home/PackageTags"; // Usa el mismo si ya lo tenés

const PackageCard = ({ pkg, onView }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg bg-white transition-all duration-300 ${hover ? "-translate-y-2 shadow-2xl" : "translate-y-0"
        }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Imagen principal */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.imagenPrincipal}
          alt={pkg.nombre}
          className={`w-full h-full object-cover transition-transform duration-500 ${hover ? "scale-110" : "scale-100"
            }`}
        />

        {pkg.etiquetas?.length > 0 && (
          <PackageTags etiquetas={pkg.etiquetas} />
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col justify-between h-[240px]">
        <div>
          <h3 className="text-lg font-bold text-dark mb-1">{pkg.nombre}</h3>
          {pkg?.destinos?.length > 0 && (
            <p className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin size={14} className="mr-1" />
              {pkg.destinos.map((d) => d.ciudad).join(", ")}
            </p>
          )}
          <p className="text-sm text-gray-600 line-clamp-3">
            {pkg.descripcionCorta || pkg.descripcion || "Sin descripción"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-xl font-semibold text-primary-blue">
              ${pkg.precioBase?.toLocaleString() ?? 0}
            </p>
          </div>

          <button
            onClick={() => onView(pkg._id)}
            className="bg-primary-blue text-white font-semibold rounded-full px-5 py-2 text-sm hover:scale-105 transition-transform"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
