import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const PackageFilterBar = ({ filters, onChange }) => {
  // Estado local para evitar múltiples llamadas
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sincronizar cuando cambien los filtros externos
  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  // Manejar búsqueda con Enter o botón
  const handleSearch = () => {
    onChange({ ...filters, search: localSearch });
  };

  // Buscar al presionar Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setLocalSearch("");
    const { search, ...restFilters } = filters;
    onChange(restFilters);
  };

  // Cambiar tipo (llama inmediatamente porque es un selector)
  const handleTipoChange = (value) => {
    if (value === "") {
      const { tipo, ...restFilters } = filters;
      onChange(restFilters);
    } else {
      onChange({ ...filters, tipo: value });
    }
  };

  // Cambiar etiqueta (llama inmediatamente porque es un selector)
  const handleEtiquetaChange = (value) => {
    if (value === "") {
      const { etiqueta, ...restFilters } = filters;
      onChange(restFilters);
    } else {
      onChange({ ...filters, etiqueta: value });
    }
  };

  // Contar filtros activos
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key] && key !== "search"
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
      {/* Barra principal */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por destino o nombre del paquete..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {localSearch && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Botón buscar */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar</span>
          </button>

          {/* Botón filtros avanzados */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="relative bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filtros rápidos desplegables */}
      {showAdvanced && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de paquete
              </label>
              <select
                value={filters.tipo || ""}
                onChange={(e) => handleTipoChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Todos los tipos</option>
                <option value="nacional">Nacional</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>

            {/* Etiqueta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiqueta especial
              </label>
              <select
                value={filters.etiqueta || ""}
                onChange={(e) => handleEtiquetaChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Todas las etiquetas</option>
                <option value="oferta">🔥 Oferta</option>
                <option value="nuevo">✨ Nuevo</option>
                <option value="mas vendido">⭐ Más vendido</option>
                <option value="recomendado">👍 Recomendado</option>
                <option value="exclusivo">💎 Exclusivo</option>
              </select>
            </div>
          </div>

          {/* Filtros activos */}
          {(filters.tipo || filters.etiqueta) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Filtros rápidos activos:</p>
                <button
                  onClick={() => {
                    const { tipo, etiqueta, ...restFilters } = filters;
                    onChange(restFilters);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Limpiar
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.tipo && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    {filters.tipo === "nacional" ? "Nacional" : "Internacional"}
                    <button
                      onClick={() => handleTipoChange("")}
                      className="hover:text-green-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.etiqueta && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                    {filters.etiqueta.charAt(0).toUpperCase() + filters.etiqueta.slice(1)}
                    <button
                      onClick={() => handleEtiquetaChange("")}
                      className="hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
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

export default PackageFilterBar;