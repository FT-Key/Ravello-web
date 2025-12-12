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
    <div className="bg-white rounded-2xl shadow-lg p-6 no-select">
      <h2 className="text-2xl font-bold text-dark mb-4 no-select">
        Qué incluye este paquete
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 no-select">
        {pkg.incluyeGeneral && pkg.incluyeGeneral.length > 0 && (
          <div className="no-select">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2 no-select">
              <CheckCircle className="text-green-600 no-select" size={20} />
              <span className="no-select">Incluye</span>
            </h3>
            <ul className="space-y-2 no-select">
              {pkg.incluyeGeneral.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm no-select">
                  <CheckCircle
                    size={16}
                    className="text-green-600 flex-shrink-0 mt-0.5 no-select"
                  />
                  <span className="text-light no-select">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.noIncluyeGeneral && pkg.noIncluyeGeneral.length > 0 && (
          <div className="no-select">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2 no-select">
              <XCircle className="text-red-600 no-select" size={20} />
              <span className="no-select">No incluye</span>
            </h3>
            <ul className="space-y-2 no-select">
              {pkg.noIncluyeGeneral.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm no-select">
                  <XCircle
                    size={16}
                    className="text-red-600 flex-shrink-0 mt-0.5 no-select"
                  />
                  <span className="text-light no-select">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
