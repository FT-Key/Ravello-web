// src/components/admin/PackageDateFilterBar.jsx
import React from "react";

export default function PackageDateFilterBar({
  query,
  setQuery,
  onFilterChange,
  onCreate,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
        className="border px-3 py-2 rounded w-64"
      />

      <select
        onChange={(e) => onFilterChange("estado", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Estado</option>
        <option value="disponible">Disponible</option>
        <option value="agotado">Agotado</option>
        <option value="cancelado">Cancelado</option>
      </select>

      <select
        onChange={(e) => onFilterChange("moneda", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Moneda</option>
        <option value="ARS">ARS</option>
        <option value="USD">USD</option>
      </select>

      <button
        onClick={onCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Nueva Fecha
      </button>
    </div>
  );
}
