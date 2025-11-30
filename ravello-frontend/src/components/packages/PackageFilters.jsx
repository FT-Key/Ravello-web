import React, { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

const PackageFilters = ({ filters, onChange }) => {
  // Estado para controlar si está expandido
  const [isExpanded, setIsExpanded] = useState(false);

  // Estado local para los filtros antes de aplicarlos
  const [localFilters, setLocalFilters] = useState({
    maxPrecio: filters.maxPrecio || "",
    minDias: filters.minDias || "",
    pension: filters.pension || "",
    categoria: filters.categoria || "",
    ciudad: filters.ciudad || "",
  });

  // Opciones para los selectores
  const pensionOptions = [
    { value: "", label: "Todas" },
    { value: "sin comida", label: "Sin comida" },
    { value: "media pension", label: "Media pensión" },
    { value: "pension completa", label: "Pensión completa" },
  ];

  const categoriaOptions = [
    { value: "", label: "Todas" },
    { value: "1 estrella", label: "1 estrella" },
    { value: "2 estrellas", label: "2 estrellas" },
    { value: "3 estrellas", label: "3 estrellas" },
    { value: "4 estrellas", label: "4 estrellas" },
    { value: "5 estrellas", label: "5 estrellas" },
  ];

  // Actualizar filtros locales
  const handleLocalChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aplicar filtros (llamar al backend)
  const handleApplyFilters = () => {
    // Limpiar valores vacíos antes de enviar
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => value !== "")
    );
    
    onChange({ ...filters, ...cleanedFilters });
  };

  // Limpiar todos los filtros avanzados
  const handleClearFilters = () => {
    const emptyFilters = {
      maxPrecio: "",
      minDias: "",
      pension: "",
      categoria: "",
      ciudad: "",
    };
    
    setLocalFilters(emptyFilters);
    
    // Mantener solo search, tipo y etiqueta del filtro original
    const { maxPrecio, minDias, pension, categoria, ciudad, ...restFilters } = filters;
    onChange(restFilters);
  };

  // Verificar si hay filtros avanzados activos
  const hasActiveAdvancedFilters = Object.entries(filters)
    .filter(([key]) => !["search", "tipo", "etiqueta"].includes(key))
    .some(([_, value]) => value !== "");

  const activeFiltersCount = Object.values(localFilters).filter(v => v !== "").length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
      {/* Header desplegable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Filtros avanzados
          </h3>
          {hasActiveAdvancedFilters && (
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveAdvancedFilters && (
            <span className="text-sm text-blue-600 font-medium mr-2">
              Filtros activos
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </button>

      {/* Contenido desplegable */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6">
          {hasActiveAdvancedFilters && (
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros avanzados
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo (ARS)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={localFilters.maxPrecio}
                onChange={(e) => handleLocalChange("maxPrecio", e.target.value)}
                placeholder="Ej: 500000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Duración mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración mínima (días)
              </label>
              <input
                type="number"
                min="1"
                value={localFilters.minDias}
                onChange={(e) => handleLocalChange("minDias", e.target.value)}
                placeholder="Ej: 3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad destino
              </label>
              <input
                type="text"
                value={localFilters.ciudad}
                onChange={(e) => handleLocalChange("ciudad", e.target.value)}
                placeholder="Ej: Bariloche"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Pensión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Régimen alimenticio
              </label>
              <select
                value={localFilters.pension}
                onChange={(e) => handleLocalChange("pension", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                {pensionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoría hotel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría de hospedaje
              </label>
              <select
                value={localFilters.categoria}
                onChange={(e) => handleLocalChange("categoria", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                {categoriaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón de aplicar filtros */}
          <div className="flex justify-end">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              Aplicar filtros
            </button>
          </div>

          {/* Indicador de filtros activos */}
          {hasActiveAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Filtros aplicados:</p>
              <div className="flex flex-wrap gap-2">
                {localFilters.maxPrecio && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    Precio máx: ${parseInt(localFilters.maxPrecio).toLocaleString()}
                  </span>
                )}
                {localFilters.minDias && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    Mín {localFilters.minDias} días
                  </span>
                )}
                {localFilters.ciudad && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    Ciudad: {localFilters.ciudad}
                  </span>
                )}
                {localFilters.pension && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {pensionOptions.find((o) => o.value === localFilters.pension)?.label}
                  </span>
                )}
                {localFilters.categoria && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {categoriaOptions.find((o) => o.value === localFilters.categoria)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageFilters;