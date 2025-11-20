import React from "react";

const PackageFilterBar = ({ filters, onChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
      <input
        type="text"
        placeholder="Buscar destino o paquete..."
        value={filters.search || ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
      />

      <select
        value={filters.tipo || ""}
        onChange={(e) => onChange({ ...filters, tipo: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
      >
        <option value="">Todos los tipos</option>
        <option value="nacional">Nacional</option>
        <option value="internacional">Internacional</option>
      </select>

      <select
        value={filters.etiqueta || ""}
        onChange={(e) => onChange({ ...filters, etiqueta: e.target.value })}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
      >
        <option value="">Todas las etiquetas</option>
        <option value="oferta">Oferta</option>
        <option value="nuevo">Nuevo</option>
        <option value="mas vendido">Más vendido</option>
        <option value="recomendado">Recomendado</option>
        <option value="exclusivo">Exclusivo</option>
      </select>
    </div>
  );
};

export default PackageFilterBar;
