import React from "react";

export default function UserFilterBar({
  query,
  setQuery,
  onFilterChange,
  onCreate,
}) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/3"
      />

      {/* 🧩 Filtro por rol */}
      <select
        onChange={(e) => onFilterChange("rol", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Todos los roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="cliente">Cliente</option>
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

      {/* ➕ Botón de nuevo usuario */}
      <button
        onClick={onCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Nuevo usuario
      </button>
    </div>
  );
}
