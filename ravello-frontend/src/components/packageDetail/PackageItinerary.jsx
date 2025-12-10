import React from "react";
import { MapPin } from "lucide-react";
import ItineraryDestinationCard from "./ItineraryDestinationCard";

export default function PackageItinerary({ pkg }) {
  if (!pkg.destinos || pkg.destinos.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
        <MapPin className="text-primary-blue" />
        Itinerario del viaje ({pkg.duracionTotal || 0} días totales)
      </h2>
      
      <div className="space-y-6">
        {pkg.destinos
          .sort((a, b) => a.orden - b.orden)
          .map((destino, idx) => (
            <ItineraryDestinationCard key={idx} destino={destino} />
          ))}
      </div>
    </div>
  );
}