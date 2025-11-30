import React, { useState } from "react";

export default function ReviewFilterBar({ onApply }) {
  const [search, setSearch] = useState("");
  const [localFilters, setLocalFilters] = useState({
    tipo: "",
    estadoModeracion: "",
  });

  const updateLocalFilter = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // 🔥 Limpiar filtros vacíos
    const cleanFilters = {};
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        cleanFilters[key] = value;
      }
    });

    // 🔥 Solo enviar search si tiene contenido
    const payload = {
      filters: cleanFilters,
    };

    if (search && search.trim() !== "") {
      payload.search = search.trim();
      // Buscar en campos directos del modelo
      payload.searchFields = "nombre,comentario,email";
    }

    console.log("📤 Enviando filtros de reviews:", payload);
    onApply(payload);
  };

  const handleReset = () => {
    setSearch("");
    setLocalFilters({
      tipo: "",
      estadoModeracion: "",
    });
    onApply({ filters: {} });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-center">

      {/* 🔍 BUSCAR */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleApply();
        }}
        placeholder="Buscar por autor, comentario, email..."
        className="border px-3 py-2 rounded w-64"
      />

      {/* TIPO */}
      <select
        value={localFilters.tipo}
        onChange={(e) => updateLocalFilter("tipo", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Todos los tipos</option>
        <option value="empresa">Empresa</option>
        <option value="paquete">Paquete</option>
      </select>

      {/* ESTADO DE MODERACIÓN */}
      <select
        value={localFilters.estadoModeracion}
        onChange={(e) => updateLocalFilter("estadoModeracion", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="aprobada">Aprobada</option>
        <option value="rechazada">Rechazada</option>
      </select>

      {/* 🟦 APLICAR */}
      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Aplicar filtros
      </button>

      {/* 🔄 RESET */}
      <button
        onClick={handleReset}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Limpiar
      </button>

    </div>
  );
}