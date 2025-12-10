import React from "react";
import { Users } from "lucide-react";

export default function PackageCoordinators({ pkg }) {
  if (!pkg.coordinadores || pkg.coordinadores.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-dark mb-4">
        Coordinadores del viaje
      </h2>
      
      <div className="space-y-3">
        {pkg.coordinadores.map((coord, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-background-light rounded-lg"
          >
            <Users className="text-primary-blue flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-dark">{coord.nombre}</h3>
              {coord.rol && (
                <p className="text-xs text-light capitalize">{coord.rol}</p>
              )}
              {coord.telefono && (
                <p className="text-sm text-light">📞 {coord.telefono}</p>
              )}
              {coord.email && (
                <p className="text-sm text-light">✉️ {coord.email}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}