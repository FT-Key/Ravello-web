import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function PackageInclusions({ pkg }) {
  if (
    (!pkg.incluyeGeneral || pkg.incluyeGeneral.length === 0) &&
    (!pkg.noIncluyeGeneral || pkg.noIncluyeGeneral.length === 0)
  ) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-dark mb-4">
        Qué incluye este paquete
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {pkg.incluyeGeneral && pkg.incluyeGeneral.length > 0 && (
          <div>
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Incluye
            </h3>
            <ul className="space-y-2">
              {pkg.incluyeGeneral.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.noIncluyeGeneral && pkg.noIncluyeGeneral.length > 0 && (
          <div>
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <XCircle className="text-red-600" size={20} />
              No incluye
            </h3>
            <ul className="space-y-2">
              {pkg.noIncluyeGeneral.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <XCircle
                    size={16}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}