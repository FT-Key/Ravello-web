import React from "react";
import { Users, Copy } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PackageCoordinators({ pkg }) {
  if (!pkg.coordinadores || pkg.coordinadores.length === 0) return null;

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 no-select">
      <h2 className="text-2xl font-bold text-dark mb-4 no-select">
        Coordinadores del viaje
      </h2>

      <div className="space-y-3 no-select">
        {pkg.coordinadores.map((coord, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-background-light rounded-lg"
          >
            <Users className="text-primary-blue flex-shrink-0 no-select" size={20} />

            <div className="flex-1 no-select">
              <h3 className="font-semibold text-dark no-select">
                {coord.nombre}
              </h3>

              {coord.rol && (
                <p className="text-xs text-light capitalize no-select">
                  {coord.rol}
                </p>
              )}

              {/* Teléfono */}
              {coord.telefono && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-light no-select">
                    📞 {coord.telefono}
                  </p>

                  <button
                    onClick={() => handleCopy(coord.telefono, "Teléfono")}
                    className="p-1 rounded hover:bg-gray-200 transition cursor-pointer"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}

              {/* Email */}
              {coord.email && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-light no-select">
                    ✉️ {coord.email}
                  </p>

                  <button
                    onClick={() => handleCopy(coord.email, "Email")}
                    className="p-1 rounded hover:bg-gray-200 transition cursor-pointer"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
