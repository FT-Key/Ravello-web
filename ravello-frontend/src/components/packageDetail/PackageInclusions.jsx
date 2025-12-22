import React, { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function PackageInclusions({ pkg }) {
  const [expandedIncluye, setExpandedIncluye] = useState(false);
  const [expandedNoIncluye, setExpandedNoIncluye] = useState(false);

  const incluyeGeneral = pkg?.incluyeGeneral || [];
  const noIncluyeGeneral = pkg?.noIncluyeGeneral || [];

  // Límite de items a mostrar colapsado
  const LIMIT = 5;

  const incluyeVisible = expandedIncluye 
    ? incluyeGeneral 
    : incluyeGeneral.slice(0, LIMIT);

  const noIncluyeVisible = expandedNoIncluye 
    ? noIncluyeGeneral 
    : noIncluyeGeneral.slice(0, LIMIT);

  const tieneIncluyeOcultos = incluyeGeneral.length > LIMIT;
  const tieneNoIncluyeOcultos = noIncluyeGeneral.length > LIMIT;

  // Si no hay nada que mostrar, no renderizar
  if (incluyeGeneral.length === 0 && noIncluyeGeneral.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 no-select">
      <h2 className="text-2xl font-bold text-dark mb-6 no-select">
        Qué incluye este paquete
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 no-select">
        {/* Columna: Incluye */}
        {incluyeGeneral.length > 0 && (
          <div className="no-select">
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h3 className="font-semibold text-dark mb-4 flex items-center gap-2 no-select">
                <CheckCircle className="text-green-600 no-select" size={20} />
                <span className="no-select">Incluye</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-normal">
                  {incluyeGeneral.length}
                </span>
              </h3>
              <ul className="space-y-2.5 no-select">
                {incluyeVisible.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2 text-sm no-select group"
                  >
                    <CheckCircle
                      size={16}
                      className="text-green-600 flex-shrink-0 mt-0.5 no-select group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-dark break-words line-clamp-3 no-select flex-1"
                      title={String(item).length > 100 ? item : undefined}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {tieneIncluyeOcultos && (
                <button
                  onClick={() => setExpandedIncluye(!expandedIncluye)}
                  className="mt-4 w-full text-green-700 bg-green-100 hover:bg-green-200 text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {expandedIncluye ? (
                    <>
                      <ChevronUp size={16} />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Ver {incluyeGeneral.length - LIMIT} más
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Columna: No incluye */}
        {noIncluyeGeneral.length > 0 && (
          <div className="no-select">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h3 className="font-semibold text-dark mb-4 flex items-center gap-2 no-select">
                <XCircle className="text-red-600 no-select" size={20} />
                <span className="no-select">No incluye</span>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-normal">
                  {noIncluyeGeneral.length}
                </span>
              </h3>
              <ul className="space-y-2.5 no-select">
                {noIncluyeVisible.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2 text-sm no-select group"
                  >
                    <XCircle
                      size={16}
                      className="text-red-600 flex-shrink-0 mt-0.5 no-select group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-dark break-words line-clamp-3 no-select flex-1"
                      title={String(item).length > 100 ? item : undefined}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {tieneNoIncluyeOcultos && (
                <button
                  onClick={() => setExpandedNoIncluye(!expandedNoIncluye)}
                  className="mt-4 w-full text-red-700 bg-red-100 hover:bg-red-200 text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {expandedNoIncluye ? (
                    <>
                      <ChevronUp size={16} />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Ver {noIncluyeGeneral.length - LIMIT} más
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mensaje si solo hay una columna */}
      {incluyeGeneral.length === 0 && noIncluyeGeneral.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500 italic">
          ℹ️ No se especificaron inclusiones para este paquete
        </div>
      )}
      {noIncluyeGeneral.length === 0 && incluyeGeneral.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500 italic">
          ℹ️ No se especificaron exclusiones para este paquete
        </div>
      )}
    </div>
  );
}