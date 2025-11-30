// src/components/admin/ContactFilterBar.jsx
import React, { useState } from "react";

export default function ContactFilterBar({ onApply }) {
  const [search, setSearch] = useState("");
  const [localFilters, setLocalFilters] = useState({
    leido: "",
    asunto: "",
  });
  const [dateRange, setDateRange] = useState({
    desde: "",
    hasta: "",
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

    // 📅 Agregar filtros de fecha si están presentes
    if (dateRange.desde) {
      cleanFilters.createdAt = { $gte: new Date(dateRange.desde) };
    }
    if (dateRange.hasta) {
      const hasta = new Date(dateRange.hasta);
      hasta.setHours(23, 59, 59, 999); // Incluir todo el día
      cleanFilters.createdAt = {
        ...cleanFilters.createdAt,
        $lte: hasta,
      };
    }

    // 🔥 Solo enviar search si tiene contenido
    const payload = {
      filters: cleanFilters,
    };

    if (search && search.trim() !== "") {
      payload.search = search.trim();
      // Buscar en campos del modelo ContactMessage
      payload.searchFields = "nombre,email,telefono,asunto,mensaje";
    }

    console.log("📤 Enviando filtros de contactos:", payload);
    onApply(payload);
  };

  const handleReset = () => {
    setSearch("");
    setLocalFilters({
      leido: "",
      asunto: "",
    });
    setDateRange({
      desde: "",
      hasta: "",
    });
    onApply({ filters: {} });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 space-y-4">
      
      {/* Primera fila: Búsqueda y filtros principales */}
      <div className="flex flex-wrap gap-4 items-center">
        
        {/* 🔍 BUSCAR */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
          placeholder="Buscar por nombre, email, teléfono, mensaje..."
          className="border px-3 py-2 rounded flex-1 min-w-[300px]"
        />

        {/* 📬 ESTADO (Leído/No leído) */}
        <select
          value={localFilters.leido}
          onChange={(e) => updateLocalFilter("leido", e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Todos los mensajes</option>
          <option value="false">No leídos</option>
          <option value="true">Leídos</option>
        </select>

        {/* 📝 ASUNTO */}
        <input
          type="text"
          value={localFilters.asunto}
          onChange={(e) => updateLocalFilter("asunto", e.target.value)}
          placeholder="Filtrar por asunto..."
          className="border px-3 py-2 rounded w-48"
        />

      </div>

      {/* Segunda fila: Rango de fechas */}
      <div className="flex flex-wrap gap-4 items-center">
        
        {/* 📅 DESDE */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Desde:</label>
          <input
            type="date"
            value={dateRange.desde}
            onChange={(e) => setDateRange((prev) => ({ ...prev, desde: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* 📅 HASTA */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Hasta:</label>
          <input
            type="date"
            value={dateRange.hasta}
            onChange={(e) => setDateRange((prev) => ({ ...prev, hasta: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* 🟦 APLICAR */}
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Aplicar filtros
        </button>

        {/* 🔄 RESET */}
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Limpiar
        </button>

        {/* 📊 Contador de resultados */}
        <div className="ml-auto text-sm text-gray-600">
          Presiona Enter o click en Aplicar para buscar
        </div>

      </div>

    </div>
  );
}