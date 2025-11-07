import React from "react";

export default function PackageFilterBar({ query, setQuery, onCreate, onFilterChange }) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
      <input
        type="text"
        placeholder="Buscar paquetes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/3"
      />

      <select
        onChange={(e) => onFilterChange("tipo", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Todos los tipos</option>
        <option value="nacional">Nacional</option>
        <option value="internacional">Internacional</option>
      </select>

      <select
        onChange={(e) => onFilterChange("publicado", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="">Publicados y no publicados</option>
        <option value="true">Solo publicados</option>
        <option value="false">Solo no publicados</option>
      </select>

      <button
        onClick={onCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Nuevo paquete
      </button>
    </div>
  );
}
