import React from "react";

const PackageFilters = ({ filters, onChange }) => {
  return (
    <div className="bg-gray-50 rounded-xl shadow p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4">Filtros avanzados</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Precio máximo (ARS)</label>
          <input
            type="number"
            value={filters.maxPrecio || ""}
            onChange={(e) => onChange({ ...filters, maxPrecio: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Duración mínima (días)</label>
          <input
            type="number"
            value={filters.minDias || ""}
            onChange={(e) => onChange({ ...filters, minDias: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageFilters;
