import React from "react";
import { Clock, Calendar, Plane, Hotel, Utensils, Camera, CheckCircle, Info } from "lucide-react";

export default function ItineraryDestinationCard({ destino }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="border border-border-subtle rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-primary-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
          {destino.orden}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-dark text-lg mb-2">
            {destino.ciudad}
            {destino.pais && `, ${destino.pais}`}
          </h3>

          <div className="flex items-center gap-4 text-sm text-light mb-3">
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-primary-blue" />
              <span className="font-medium">{destino.diasEstadia} días</span>
            </div>
            {destino.fechaInicio && destino.fechaFin && (
              <div className="flex items-center gap-1">
                <Calendar size={16} className="text-primary-blue" />
                <span className="text-xs">
                  {formatDate(destino.fechaInicio)} - {formatDate(destino.fechaFin)}
                </span>
              </div>
            )}
          </div>

          {destino.descripcion && (
            <p className="text-sm text-light mb-4">{destino.descripcion}</p>
          )}

          {/* Traslado de salida */}
          {destino.trasladoSalida && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane size={16} className="text-primary-blue" />
                <h4 className="font-semibold text-dark text-sm">
                  Traslado desde {destino.ciudad}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {destino.trasladoSalida.salida && (
                  <div>
                    <p className="text-light mb-1">Salida</p>
                    <p className="font-medium text-dark">
                      {destino.trasladoSalida.salida.lugar}
                    </p>
                    {destino.trasladoSalida.salida.hora && (
                      <p className="text-light">{destino.trasladoSalida.salida.hora}</p>
                    )}
                  </div>
                )}
                {destino.trasladoSalida.llegada && (
                  <div>
                    <p className="text-light mb-1">Llegada</p>
                    <p className="font-medium text-dark">
                      {destino.trasladoSalida.llegada.lugar}
                    </p>
                    {destino.trasladoSalida.llegada.hora && (
                      <p className="text-light">{destino.trasladoSalida.llegada.hora}</p>
                    )}
                  </div>
                )}
              </div>
              {destino.trasladoSalida.compania && (
                <p className="text-xs text-light mt-2">
                  <span className="font-medium capitalize">{destino.trasladoSalida.tipo}</span>
                  {" - "}
                  {destino.trasladoSalida.compania}
                </p>
              )}
            </div>
          )}

          {/* Hospedaje */}
          {destino.hospedaje && (
            <div className="bg-background-light rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Hotel size={16} className="text-primary-blue" />
                <h4 className="font-semibold text-dark text-sm">
                  {destino.hospedaje.nombre}
                </h4>
              </div>
              {destino.hospedaje.categoria && (
                <p className="text-xs text-light mb-1 capitalize">
                  {destino.hospedaje.categoria}
                </p>
              )}
              {destino.hospedaje.ubicacion && (
                <p className="text-xs text-light mb-2">📍 {destino.hospedaje.ubicacion}</p>
              )}
              {destino.hospedaje.caracteristicas && destino.hospedaje.caracteristicas.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {destino.hospedaje.caracteristicas.map((c, i) => (
                    <span key={i} className="text-xs bg-white px-2 py-1 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {destino.hospedaje.gastronomia && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs">
                    <Utensils size={14} className="text-primary-blue" />
                    <span className="font-medium capitalize">
                      {destino.hospedaje.gastronomia.pension}
                    </span>
                  </div>
                  {destino.hospedaje.gastronomia.descripcion && (
                    <p className="text-xs text-light mt-1">
                      {destino.hospedaje.gastronomia.descripcion}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actividades */}
          {destino.actividades && destino.actividades.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-dark text-sm flex items-center gap-1">
                <Camera size={16} className="text-primary-blue" />
                Actividades en {destino.ciudad}
              </h4>
              {destino.actividades.map((act, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-green-50 rounded-lg p-3">
                  <CheckCircle
                    size={16}
                    className={`flex-shrink-0 mt-0.5 ${
                      act.incluido ? "text-green-600" : "text-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-dark">{act.nombre}</p>
                      {!act.incluido && act.precio && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          +${act.precio}
                        </span>
                      )}
                    </div>
                    {act.descripcion && (
                      <p className="text-xs text-light mt-1">{act.descripcion}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      {act.duracion && <p className="text-xs text-light">⏱️ {act.duracion}</p>}
                      {act.hora && <p className="text-xs text-light">🕐 {act.hora}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {destino.notas && (
            <div className="mt-3 flex items-start gap-2 text-xs text-light bg-yellow-50 p-2 rounded">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <p>{destino.notas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}