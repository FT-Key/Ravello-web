import React from "react";

export default function ReviewFilterBar({
  query,
  setQuery,
  filters,
  onFilterChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        placeholder="Buscar por autor o comentario..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded flex-1 min-w-[250px]"
      />

      <select
        value={filters.tipo}
        onChange={(e) => onFilterChange("tipo", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Todos los tipos</option>
        <option value="empresa">Empresa</option>
        <option value="paquete">Paquete</option>
      </select>

      <select
        value={filters.estado}
        onChange={(e) => onFilterChange("estado", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="aprobada">Aprobada</option>
        <option value="rechazada">Rechazada</option>
      </select>
    </div>
  );
}
