import { Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const TabIncluye = ({ watch, setValue }) => {
  const [nuevoIncluye, setNuevoIncluye] = useState("");
  const [nuevoNoIncluye, setNuevoNoIncluye] = useState("");

  const incluyeGeneral = watch("incluyeGeneral") || [];
  const noIncluyeGeneral = watch("noIncluyeGeneral") || [];

  const agregarIncluye = () => {
    if (nuevoIncluye.trim()) {
      setValue("incluyeGeneral", [...incluyeGeneral, nuevoIncluye.trim()]);
      setNuevoIncluye("");
    }
  };

  const agregarNoIncluye = () => {
    if (nuevoNoIncluye.trim()) {
      setValue("noIncluyeGeneral", [...noIncluyeGeneral, nuevoNoIncluye.trim()]);
      setNuevoNoIncluye("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Info size={20} className="text-green-600" />
          ¿Qué incluye?
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            value={nuevoIncluye}
            onChange={(e) => setNuevoIncluye(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarIncluye())}
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Ej: Seguro de viaje"
          />
          <button type="button" onClick={agregarIncluye} className="px-4 py-2 bg-green-600 text-white rounded-lg">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {incluyeGeneral.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
              <span className="text-green-600">✓</span>
              <span className="flex-1 text-sm">{item}</span>
              <button
                type="button"
                onClick={() => setValue("incluyeGeneral", incluyeGeneral.filter((_, idx) => idx !== i))}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Info size={20} className="text-red-600" />
          ¿Qué NO incluye?
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            value={nuevoNoIncluye}
            onChange={(e) => setNuevoNoIncluye(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarNoIncluye())}
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Ej: Propinas"
          />
          <button type="button" onClick={agregarNoIncluye} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {noIncluyeGeneral.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
              <span className="text-red-600">✗</span>
              <span className="flex-1 text-sm">{item}</span>
              <button
                type="button"
                onClick={() => setValue("noIncluyeGeneral", noIncluyeGeneral.filter((_, idx) => idx !== i))}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
