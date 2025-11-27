// src/components/admin/PackageFilterBar.jsx
import React, { useState } from "react";

export default function PackageFilterBar({ onApply, onCreate }) {
  const [search, setSearch] = useState("");
  const [localFilters, setLocalFilters] = useState({
    tipo: "",
    visibleEnWeb: "",
    activo: "",
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
      payload.searchFields = "nombre,descripcion,tipo";
    }

    console.log("📤 Enviando filtros de packages:", payload);
    onApply(payload);
  };

  const handleReset = () => {
    setSearch("");
    setLocalFilters({
      tipo: "",
      visibleEnWeb: "",
      activo: "",
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
        placeholder="Buscar por nombre, descripción, tipo..."
        className="border px-3 py-2 rounded w-64"
      />

      {/* 🌎 TIPO */}
      <select
        value={localFilters.tipo}
        onChange={(e) => updateLocalFilter("tipo", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Todos los tipos</option>
        <option value="nacional">Nacional</option>
        <option value="internacional">Internacional</option>
      </select>

      {/* 👁️ VISIBLE EN WEB */}
      <select
        value={localFilters.visibleEnWeb}
        onChange={(e) => updateLocalFilter("visibleEnWeb", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Visibles y ocultos</option>
        <option value="true">Solo visibles en la web</option>
        <option value="false">Solo ocultos</option>
      </select>

      {/* ✅ ACTIVO */}
      <select
        value={localFilters.activo}
        onChange={(e) => updateLocalFilter("activo", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Activos e inactivos</option>
        <option value="true">Solo activos</option>
        <option value="false">Solo inactivos</option>
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

      {/* ➕ CREAR NUEVO PAQUETE */}
      <button
        onClick={onCreate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto"
      >
        + Nuevo paquete
      </button>

    </div>
  );
}