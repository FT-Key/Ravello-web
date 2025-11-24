// src/components/admin/PackageDateFilterBar.jsx
import React, { useState } from "react";

export default function PackageDateFilterBar({ onApply, onCreate }) {
  const [search, setSearch] = useState("");
  const [localFilters, setLocalFilters] = useState({
    estado: "",
    moneda: "",
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
      // Buscar en campos directos del modelo, no en referencias pobladas
      payload.searchFields = "estado,moneda,notas";
    }

    console.log("📤 Enviando filtros:", payload);
    onApply(payload);
  };

  const handleReset = () => {
    setSearch("");
    setLocalFilters({
      estado: "",
      moneda: "",
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
        placeholder="Buscar en estado, moneda, notas..."
        className="border px-3 py-2 rounded w-64"
      />

      {/* ESTADO */}
      <select
        value={localFilters.estado}
        onChange={(e) => updateLocalFilter("estado", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Todos los estados</option>
        <option value="disponible">Disponible</option>
        <option value="agotado">Agotado</option>
        <option value="cancelado">Cancelado</option>
      </select>

      {/* MONEDA */}
      <select
        value={localFilters.moneda}
        onChange={(e) => updateLocalFilter("moneda", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Todas las monedas</option>
        <option value="ARS">ARS</option>
        <option value="USD">USD</option>
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

      {/* ➕ CREAR NUEVA FECHA */}
      <button
        onClick={onCreate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto"
      >
        Nueva Fecha
      </button>

    </div>
  );
}