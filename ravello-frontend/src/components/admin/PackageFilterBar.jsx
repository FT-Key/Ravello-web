import React from "react";

export default function PackageFilterBar({
  query,
  setQuery,
  onCreate,
  onFilterChange,
}) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Buscar paquetes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/3"
      />

      {/* 🌎 Filtro por tipo */}
      <select
        onChange={(e) => onFilterChange("tipo", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Todos los tipos</option>
        <option value="nacional">Nacional</option>
        <option value="internacional">Internacional</option>
      </select>

      {/* 👁️ Filtro por visibilidad */}
      <select
        onChange={(e) => onFilterChange("visibleEnWeb", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Visibles y ocultos</option>
        <option value="true">Solo visibles en la web</option>
        <option value="false">Solo ocultos</option>
      </select>

      {/* ✅ Filtro por estado activo */}
      <select
        onChange={(e) => onFilterChange("activo", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Activos e inactivos</option>
        <option value="true">Solo activos</option>
        <option value="false">Solo inactivos</option>
      </select>

      {/* ➕ Botón de nuevo paquete */}
      <button
        onClick={onCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Nuevo paquete
      </button>
    </div>
  );
}
