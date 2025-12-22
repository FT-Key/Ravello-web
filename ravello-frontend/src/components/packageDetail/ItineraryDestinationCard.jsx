// ItineraryDestinationCard.jsx
import React, { useState } from "react";
import { Clock, Calendar, Plane, Hotel, Utensils, Camera, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";

export default function ItineraryDestinationCard({ destino }) {
  // Estados para expandir/colapsar secciones
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedHospedaje, setExpandedHospedaje] = useState(false);
  const [expandedActividades, setExpandedActividades] = useState({});
  const [expandedNotas, setExpandedNotas] = useState(false);
  const [expandedTraslado, setExpandedTraslado] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  const shouldTruncate = (text, maxLength) => {
    if (!text) return false;
    return String(text).length > maxLength;
  };

  const toggleActividad = (index) => {
    setExpandedActividades(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="border border-border-subtle rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start gap-4">
        <div className="bg-primary-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
          {destino.orden || "?"}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-dark text-lg mb-2 break-words line-clamp-2">
            {destino.ciudad || "Destino sin nombre"}
            {destino.pais && `, ${destino.pais}`}
          </h3>

          <div className="flex items-center gap-4 text-sm text-light mb-3 flex-wrap">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock size={16} className="text-primary-blue flex-shrink-0" />
              <span className="font-medium">
                {destino.diasEstadia || 0} {destino.diasEstadia === 1 ? "día" : "días"}
              </span>
            </div>
            {destino.fechaInicio && destino.fechaFin && (
              <div className="flex items-center gap-1 flex-wrap">
                <Calendar size={16} className="text-primary-blue flex-shrink-0" />
                <span className="text-xs break-words">
                  {formatDate(destino.fechaInicio)} - {formatDate(destino.fechaFin)}
                </span>
              </div>
            )}
          </div>

          {/* Descripción del destino con expand/collapse */}
          {destino.descripcion && (
            <div className="text-sm text-light mb-4">
              <p className={`break-words ${!expandedDescription && shouldTruncate(destino.descripcion, 300) ? 'line-clamp-3' : ''}`}>
                {destino.descripcion}
              </p>
              {shouldTruncate(destino.descripcion, 300) && (
                <button
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="text-primary-blue text-xs font-medium mt-1 flex items-center gap-1 hover:underline"
                >
                  {expandedDescription ? (
                    <>
                      <ChevronUp size={14} />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      Ver más
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Traslado de salida */}
          {destino.trasladoSalida && destino.trasladoSalida.tipo && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane size={16} className="text-primary-blue flex-shrink-0" />
                <h4 className="font-semibold text-dark text-sm break-words line-clamp-1">
                  Traslado desde {destino.ciudad || "este destino"}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {destino.trasladoSalida.salida?.lugar && (
                  <div className="min-w-0">
                    <p className="text-light mb-1">Salida</p>
                    <p className={`font-medium text-dark break-words ${!expandedTraslado ? 'line-clamp-2' : ''}`}>
                      {destino.trasladoSalida.salida.lugar}
                    </p>
                    {destino.trasladoSalida.salida.hora && (
                      <p className="text-light mt-1">{destino.trasladoSalida.salida.hora}</p>
                    )}
                  </div>
                )}
                {destino.trasladoSalida.llegada?.lugar && (
                  <div className="min-w-0">
                    <p className="text-light mb-1">Llegada</p>
                    <p className={`font-medium text-dark break-words ${!expandedTraslado ? 'line-clamp-2' : ''}`}>
                      {destino.trasladoSalida.llegada.lugar}
                    </p>
                    {destino.trasladoSalida.llegada.hora && (
                      <p className="text-light mt-1">{destino.trasladoSalida.llegada.hora}</p>
                    )}
                  </div>
                )}
              </div>
              {destino.trasladoSalida.compania && (
                <p className={`text-xs text-light mt-2 break-words ${!expandedTraslado ? 'line-clamp-1' : ''}`}>
                  <span className="font-medium capitalize">
                    {destino.trasladoSalida.tipo}
                  </span>
                  {" - "}
                  {destino.trasladoSalida.compania}
                </p>
              )}
              {destino.trasladoSalida.descripcion && (
                <p className={`text-xs text-light mt-2 break-words ${!expandedTraslado ? 'line-clamp-2' : ''}`}>
                  {destino.trasladoSalida.descripcion}
                </p>
              )}
              {(shouldTruncate(destino.trasladoSalida.salida?.lugar, 50) || 
                shouldTruncate(destino.trasladoSalida.llegada?.lugar, 50) ||
                shouldTruncate(destino.trasladoSalida.compania, 50) ||
                shouldTruncate(destino.trasladoSalida.descripcion, 100)) && (
                <button
                  onClick={() => setExpandedTraslado(!expandedTraslado)}
                  className="text-primary-blue text-xs font-medium mt-2 flex items-center gap-1 hover:underline"
                >
                  {expandedTraslado ? (
                    <>
                      <ChevronUp size={12} />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      Ver más
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Hospedaje con expand/collapse */}
          {destino.hospedaje && destino.hospedaje.nombre && (
            <div className="bg-background-light rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Hotel size={16} className="text-primary-blue flex-shrink-0" />
                <h4 className={`font-semibold text-dark text-sm break-words flex-1 ${!expandedHospedaje ? 'line-clamp-2' : ''}`}>
                  {destino.hospedaje.nombre}
                </h4>
              </div>
              {destino.hospedaje.categoria && (
                <p className="text-xs text-light mb-1 capitalize">
                  {destino.hospedaje.categoria}
                </p>
              )}
              {destino.hospedaje.ubicacion && (
                <p 
                  className={`text-xs text-light mb-2 break-words ${!expandedHospedaje ? 'line-clamp-2' : ''}`}
                >
                  📍 {destino.hospedaje.ubicacion}
                </p>
              )}
              {destino.hospedaje.caracteristicas && destino.hospedaje.caracteristicas.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(expandedHospedaje 
                    ? destino.hospedaje.caracteristicas 
                    : destino.hospedaje.caracteristicas.slice(0, 6)
                  ).map((c, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-white px-2 py-1 rounded break-words"
                      title={String(c)}
                    >
                      {String(c).length > 20 && !expandedHospedaje ? `${String(c).substring(0, 20)}...` : c}
                    </span>
                  ))}
                  {!expandedHospedaje && destino.hospedaje.caracteristicas.length > 6 && (
                    <span className="text-xs bg-white px-2 py-1 rounded text-gray-500">
                      +{destino.hospedaje.caracteristicas.length - 6}
                    </span>
                  )}
                </div>
              )}
              {destino.hospedaje.gastronomia && destino.hospedaje.gastronomia.pension && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs">
                    <Utensils size={14} className="text-primary-blue flex-shrink-0" />
                    <span className="font-medium capitalize break-words">
                      {destino.hospedaje.gastronomia.pension}
                    </span>
                  </div>
                  {destino.hospedaje.gastronomia.descripcion && (
                    <p className={`text-xs text-light mt-1 break-words ${!expandedHospedaje ? 'line-clamp-2' : ''}`}>
                      {destino.hospedaje.gastronomia.descripcion}
                    </p>
                  )}
                </div>
              )}
              {(shouldTruncate(destino.hospedaje.nombre, 50) ||
                shouldTruncate(destino.hospedaje.ubicacion, 60) ||
                (destino.hospedaje.caracteristicas && destino.hospedaje.caracteristicas.length > 6) ||
                shouldTruncate(destino.hospedaje.gastronomia?.descripcion, 100)) && (
                <button
                  onClick={() => setExpandedHospedaje(!expandedHospedaje)}
                  className="text-primary-blue text-xs font-medium mt-2 flex items-center gap-1 hover:underline"
                >
                  {expandedHospedaje ? (
                    <>
                      <ChevronUp size={12} />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      Ver más detalles
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Actividades con expand/collapse individual */}
          {destino.actividades && destino.actividades.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-dark text-sm flex items-center gap-1 flex-wrap">
                <Camera size={16} className="text-primary-blue flex-shrink-0" />
                <span className="break-words">
                  Actividades en {destino.ciudad || "este destino"}
                </span>
              </h4>
              {destino.actividades.map((act, i) => {
                const isExpanded = expandedActividades[i];
                const hasLongContent = shouldTruncate(act.nombre, 60) || shouldTruncate(act.descripcion, 150);
                
                return (
                  <div key={i} className="flex items-start gap-2 text-sm bg-green-50 rounded-lg p-3">
                    <CheckCircle
                      size={16}
                      className={`flex-shrink-0 mt-0.5 ${
                        act.incluido ? "text-green-600" : "text-orange-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className={`font-medium text-dark break-words flex-1 min-w-0 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                          {act.nombre || "Actividad sin nombre"}
                        </p>
                        {!act.incluido && act.precio && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                            +${Number(act.precio).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {act.descripcion && (
                        <p className={`text-xs text-light mt-1 break-words ${!isExpanded ? 'line-clamp-3' : ''}`}>
                          {act.descripcion}
                        </p>
                      )}
                      <div className="flex gap-3 mt-1 flex-wrap">
                        {act.duracion && (
                          <p className={`text-xs text-light break-words ${!isExpanded ? 'line-clamp-1' : ''} max-w-full`}>
                            ⏱️ {act.duracion}
                          </p>
                        )}
                        {act.hora && (
                          <p className="text-xs text-light break-words line-clamp-1 max-w-full">
                            🕐 {act.hora}
                          </p>
                        )}
                        {act.fecha && (
                          <p className="text-xs text-light break-words whitespace-nowrap">
                            📅 {formatDate(act.fecha)}
                          </p>
                        )}
                      </div>
                      {hasLongContent && (
                        <button
                          onClick={() => toggleActividad(i)}
                          className="text-primary-blue text-xs font-medium mt-1 flex items-center gap-1 hover:underline"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={12} />
                              Ver menos
                            </>
                          ) : (
                            <>
                              <ChevronDown size={12} />
                              Ver más
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notas con expand/collapse */}
          {destino.notas && (
            <div className="mt-3 bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-start gap-2 text-xs text-light">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className={`break-words ${!expandedNotas && shouldTruncate(destino.notas, 200) ? 'line-clamp-4' : ''}`}>
                    {destino.notas}
                  </p>
                  {shouldTruncate(destino.notas, 200) && (
                    <button
                      onClick={() => setExpandedNotas(!expandedNotas)}
                      className="text-primary-blue text-xs font-medium mt-1 flex items-center gap-1 hover:underline"
                    >
                      {expandedNotas ? (
                        <>
                          <ChevronUp size={12} />
                          Ver menos
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} />
                          Ver más
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}