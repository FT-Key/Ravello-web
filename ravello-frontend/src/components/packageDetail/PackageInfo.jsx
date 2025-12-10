import React from "react";
import { MapPin, Star } from "lucide-react";

export default function PackageInfo({ pkg, reviewStats }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-dark mb-2">{pkg.nombre}</h1>
      
      <div className="flex items-center gap-4 text-light mb-4">
        <div className="flex items-center gap-1">
          <MapPin size={18} className="text-primary-blue" />
          <span className="text-sm">
            {pkg.destinos?.map((d) => d.ciudad).join(", ")}
          </span>
        </div>
        
        {reviewStats.total > 0 && (
          <div className="flex items-center gap-1">
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">{reviewStats.avg}</span>
            <span className="text-sm">
              ({reviewStats.total} {reviewStats.total === 1 ? "opinión" : "opiniones"})
            </span>
          </div>
        )}
      </div>

      {pkg.descripcionCorta && (
        <p className="text-lg text-dark mb-3 font-medium">
          {pkg.descripcionCorta}
        </p>
      )}

      {pkg.descripcionDetallada && (
        <p className="text-light leading-relaxed">
          {pkg.descripcionDetallada}
        </p>
      )}
    </div>
  );
}