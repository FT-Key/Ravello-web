
// PackageItinerary.jsx
import React from "react";
import { MapPin } from "lucide-react";
import ItineraryDestinationCard from "./ItineraryDestinationCard";

export default function PackageItinerary({ pkg }) {
  if (!pkg || !pkg.destinos || pkg.destinos.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
          <MapPin className="text-primary-blue" />
          <span>Itinerario del viaje</span>
        </h2>
        <div className="text-center py-8 text-gray-500">
          <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
          <p>No hay destinos configurados para este paquete</p>
        </div>
      </div>
    );
  }

  const destinosOrdenados = [...pkg.destinos]
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 no-select">
      <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2 no-select flex-wrap">
        <MapPin className="text-primary-blue no-select flex-shrink-0" />
        <span className="no-select break-words">
          Itinerario del viaje 
          {pkg.duracionTotal > 0 && (
            <span className="text-gray-600 font-normal ml-2">
              ({pkg.duracionTotal} {pkg.duracionTotal === 1 ? "día" : "días"} totales)
            </span>
          )}
        </span>
      </h2>
      
      <div className="space-y-6">
        {destinosOrdenados.map((destino, idx) => (
          <ItineraryDestinationCard 
            key={destino._id || `destino-${idx}`} 
            destino={destino} 
          />
        ))}
      </div>
    </div>
  );
}