import React, { useState } from "react";

export default function NewsletterFilterBar({ onApply, onCreate }) {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");

  const handleApply = () => {
    const payload = { filters: {} };

    // CAMBIO AQUÍ 🔥
    if (estado !== "") payload.filters.active = estado;

    if (search.trim() !== "") {
      payload.search = search.trim();
      payload.searchFields = "email";
    }

    onApply(payload);
  };

  const handleReset = () => {
    setSearch("");
    setEstado("");
    onApply({ filters: {} });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-center">

      {/* Buscar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleApply();
        }}
        placeholder="Buscar por email..."
        className="border px-3 py-2 rounded w-64"
      />

      {/* Estado */}
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </select>

      {/* Aplicar */}
      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Aplicar filtros
      </button>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Limpiar
      </button>

      {/* Crear */}
      <button
        onClick={onCreate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto"
      >
        + Nuevo
      </button>
    </div>
  );
}
