import React from "react";
import { MapPin, Star } from "lucide-react";

export default function PackageInfo({ pkg, reviewStats }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 no-select">
      <h1 className="text-3xl font-bold text-dark mb-2 no-select">
        {pkg.nombre}
      </h1>

      <div className="flex items-center gap-4 text-light mb-4 no-select">
        <div className="flex items-center gap-1 no-select">
          <MapPin size={18} className="text-primary-blue no-select" />
          <span className="text-sm no-select">
            {pkg.destinos?.map((d) => d.ciudad).join(", ")}
          </span>
        </div>

        {reviewStats.total > 0 && (
          <div className="flex items-center gap-1 no-select">
            <Star size={18} className="text-yellow-500 fill-yellow-500 no-select" />
            <span className="text-sm font-semibold no-select">
              {reviewStats.avg}
            </span>
            <span className="text-sm no-select">
              ({reviewStats.total} {reviewStats.total === 1 ? "opinión" : "opiniones"})
            </span>
          </div>
        )}
      </div>

      {pkg.descripcionCorta && (
        <p className="text-lg text-dark mb-3 font-medium no-select">
          {pkg.descripcionCorta}
        </p>
      )}

      {pkg.descripcionDetallada && (
        <p className="text-light leading-relaxed no-select">
          {pkg.descripcionDetallada}
        </p>
      )}
    </div>
  );
}
