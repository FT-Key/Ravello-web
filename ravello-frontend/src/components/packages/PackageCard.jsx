// src/components/Packages/PackageCard.jsx
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import PackageTags from "../Home/PackageTags";

const PackageCard = ({ pkg, onView }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg bg-white no-select transition-all duration-300 ${hover ? "-translate-y-2 shadow-2xl" : "translate-y-0"
        }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Imagen principal clickeable */}
      <div
        className="relative h-56 overflow-hidden cursor-pointer"
        onClick={() => onView(pkg._id)}
      >
        <img
          src={pkg.imagenPrincipal?.url}
          alt={pkg.nombre}
          draggable={false}
          className={`w-full h-full object-cover transition-transform duration-500 ${hover ? "scale-110" : "scale-100"
            }`}
        />

        {pkg.etiquetas?.length > 0 && (
          <PackageTags etiquetas={pkg.etiquetas} />
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col justify-between h-[240px]">
        <div className="overflow-hidden">
          <h3 className="text-lg font-bold text-dark mb-1 line-clamp-2 leading-tight">
            {pkg.nombre}
          </h3>

          {pkg?.destinos?.length > 0 && (
            <p className="flex items-start text-gray-500 text-sm mb-2">
              <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1 break-words">
                {pkg.destinos.map((d) => d.ciudad).join(", ")}
              </span>
            </p>
          )}

          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed break-words">
            {pkg.descripcionCorta || pkg.descripcion || "Sin descripción"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 flex-shrink-0">
          <div className="overflow-hidden">
            <p className="text-xs text-gray-500 whitespace-nowrap">Desde</p>
            <p className="text-xl font-semibold text-primary-blue whitespace-nowrap">
              ${pkg.precioBase?.toLocaleString() ?? 0}
            </p>
          </div>

          <button
            onClick={() => onView(pkg._id)}
            className="bg-primary-blue text-white font-semibold rounded-full px-5 py-2 text-sm hover:scale-105 transition-transform flex-shrink-0"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;