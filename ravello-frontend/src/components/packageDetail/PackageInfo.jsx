import React, { useState } from "react";
import { MapPin, Star, ChevronDown, ChevronUp, Clock, Tag } from "lucide-react";

export default function PackageInfo({ pkg, reviewStats }) {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState(false);

  // Validación segura de destinos
  const destinos = pkg?.destinos || [];
  const destinosTexto = destinos
    .filter(d => d?.ciudad)
    .map(d => d.ciudad)
    .join(", ");

  // Verificar si la descripción es larga
  const descripcionLarga = pkg?.descripcionDetallada && 
    String(pkg.descripcionDetallada).length > 300;

  // Verificar si el título es largo
  const tituloLargo = pkg?.nombre && String(pkg.nombre).length > 60;

  // Etiquetas del paquete
  const etiquetas = pkg?.etiquetas || [];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 no-select">
      {/* Título del paquete con expand/collapse */}
      <div className="mb-3">
        <h1 
          className={`text-3xl font-bold text-dark no-select break-words leading-tight ${
            !expandedTitle && tituloLargo ? 'line-clamp-2' : ''
          }`}
          title={tituloLargo ? pkg?.nombre : undefined}
        >
          {pkg?.nombre || "Paquete sin nombre"}
        </h1>
        {tituloLargo && (
          <button
            onClick={() => setExpandedTitle(!expandedTitle)}
            className="mt-2 text-primary-blue text-sm font-medium flex items-center gap-1 hover:underline transition-colors"
          >
            {expandedTitle ? (
              <>
                <ChevronUp size={14} />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Ver título completo
              </>
            )}
          </button>
        )}
      </div>

      {/* Badges de etiquetas */}
      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {etiquetas.map((etiqueta, idx) => {
            const badgeStyles = {
              oferta: "bg-red-100 text-red-700 border-red-200",
              nuevo: "bg-blue-100 text-blue-700 border-blue-200",
              "mas vendido": "bg-purple-100 text-purple-700 border-purple-200",
              recomendado: "bg-green-100 text-green-700 border-green-200",
              exclusivo: "bg-yellow-100 text-yellow-700 border-yellow-200",
              "ultimo momento": "bg-orange-100 text-orange-700 border-orange-200"
            };

            const emojis = {
              oferta: "🔥",
              nuevo: "✨",
              "mas vendido": "⭐",
              recomendado: "👍",
              exclusivo: "💎",
              "ultimo momento": "⚡"
            };

            return (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  badgeStyles[etiqueta] || "bg-gray-100 text-gray-700 border-gray-200"
                } capitalize flex items-center gap-1`}
              >
                <span>{emojis[etiqueta] || ""}</span>
                {etiqueta}
              </span>
            );
          })}
        </div>
      )}

      {/* Información general */}
      <div className="flex flex-wrap items-center gap-4 text-light mb-4 no-select">
        {/* Destinos */}
        {destinosTexto && (
          <div className="flex items-center gap-1 no-select">
            <MapPin size={18} className="text-primary-blue flex-shrink-0 no-select" />
            <span className="text-sm no-select break-words line-clamp-2" title={destinosTexto}>
              {destinosTexto.length > 80 
                ? `${destinosTexto.substring(0, 80)}...` 
                : destinosTexto}
            </span>
          </div>
        )}

        {/* Duración */}
        {pkg?.duracionTotal > 0 && (
          <div className="flex items-center gap-1 no-select whitespace-nowrap">
            <Clock size={18} className="text-primary-blue flex-shrink-0 no-select" />
            <span className="text-sm font-medium no-select">
              {pkg.duracionTotal} {pkg.duracionTotal === 1 ? "día" : "días"}
            </span>
          </div>
        )}

        {/* Categoría */}
        {pkg?.categoria && (
          <div className="flex items-center gap-1 no-select whitespace-nowrap">
            <Tag size={18} className="text-primary-blue flex-shrink-0 no-select" />
            <span className="text-sm capitalize no-select">
              {pkg.categoria}
            </span>
          </div>
        )}

        {/* Reviews */}
        {reviewStats?.total > 0 && (
          <div className="flex items-center gap-1 no-select whitespace-nowrap">
            <Star size={18} className="text-yellow-500 fill-yellow-500 flex-shrink-0 no-select" />
            <span className="text-sm font-semibold no-select">
              {Number(reviewStats.avg).toFixed(1)}
            </span>
            <span className="text-sm no-select">
              ({reviewStats.total} {reviewStats.total === 1 ? "opinión" : "opiniones"})
            </span>
          </div>
        )}
      </div>

      {/* Descripción corta */}
      {pkg?.descripcionCorta && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-primary-blue rounded-r-lg">
          <p className="text-base text-dark font-medium no-select break-words leading-relaxed">
            {pkg.descripcionCorta}
          </p>
        </div>
      )}

      {/* Descripción detallada con expand/collapse */}
      {pkg?.descripcionDetallada && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-dark mb-2 flex items-center gap-2">
            <span>Descripción del paquete</span>
          </h3>
          <div 
            className={`text-light leading-relaxed no-select break-words ${
              !expandedDescription && descripcionLarga ? 'line-clamp-6' : ''
            }`}
          >
            {pkg.descripcionDetallada}
          </div>
          
          {descripcionLarga && (
            <button
              onClick={() => setExpandedDescription(!expandedDescription)}
              className="mt-3 text-primary-blue text-sm font-medium flex items-center gap-1 hover:underline transition-colors"
            >
              {expandedDescription ? (
                <>
                  <ChevronUp size={16} />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Ver descripción completa
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Info adicional en grid */}
      {(pkg?.tipo || pkg?.capacidadMinima || pkg?.capacidadMaxima) && (
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {pkg.tipo && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-light mb-1">Tipo</p>
              <p className="text-sm font-semibold text-dark capitalize">{pkg.tipo}</p>
            </div>
          )}
          
          {pkg.capacidadMinima && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-light mb-1">Mínimo</p>
              <p className="text-sm font-semibold text-dark">
                {pkg.capacidadMinima} {pkg.capacidadMinima === 1 ? "persona" : "personas"}
              </p>
            </div>
          )}
          
          {pkg.capacidadMaxima && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-light mb-1">Máximo</p>
              <p className="text-sm font-semibold text-dark">
                {pkg.capacidadMaxima} {pkg.capacidadMaxima === 1 ? "persona" : "personas"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}