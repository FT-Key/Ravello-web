// ===================================================================
// components/packageDetail/sidebar/DateSelector.jsx
// ===================================================================

import React from "react";
import { Clock, AlertCircle, Loader2 } from "lucide-react";

export default function DateSelector({
  packageDates,
  selectedDate,
  setSelectedDate,
  datesLoading,
  precioAdulto,
  precioNino,
  ninos
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-border-subtle">
      {datesLoading ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Cargando fechas...</span>
        </div>
      ) : packageDates.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-blue" />
            <h3 className="font-semibold text-lg">Selecciona tu fecha de salida</h3>
          </div>

          <select
            value={selectedDate?._id || ""}
            onChange={(e) => {
              const date = packageDates.find((d) => d._id === e.target.value);
              setSelectedDate(date);
            }}
            className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            <option value="">Selecciona una fecha</option>
            {packageDates.map((date) => (
              <option key={date._id} value={date._id}>
                {formatDate(date.salida)} - {formatDate(date.regreso)}
              </option>
            ))}
          </select>

          {selectedDate && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Precio por adulto: ${precioAdulto.toLocaleString()} {selectedDate.moneda}
              </p>
              {ninos > 0 && (
                <p className="text-sm text-gray-600">
                  Precio por niño: ${precioNino.toLocaleString()} {selectedDate.moneda}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Cupos disponibles: {selectedDate.cuposDisponibles}
              </p>
              {selectedDate.cuposDisponibles < 5 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    ¡Últimos {selectedDate.cuposDisponibles} cupos!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No hay fechas disponibles en este momento</p>
        </div>
      )}
    </div>
  );
}

