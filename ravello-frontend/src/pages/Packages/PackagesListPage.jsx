// src/pages/Packages/PackageListPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import PackageCard from "../../components/packages/PackageCard";
import PackageFilterBar from "../../components/packages/PackageFilterBar";
import PackageFilters from "../../components/packages/PackageFilters";
import PackageCarousel from "../../components/packages/PackageCarousel";
import { getQueryParams } from "../../utils/getQueryParams";

const PackageListPage = () => {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // 🔹 Pre cargar filtros desde la URL
  useEffect(() => {
    const params = getQueryParams();
    const initial = {};

    // Mapear 'destino' a 'search'
    if (params.destino) initial.search = params.destino;
    if (params.search) initial.search = params.search;
    if (params.tipo) initial.tipo = params.tipo;
    if (params.etiqueta) initial.etiqueta = params.etiqueta;

    // Solo actualizar si hay filtros en la URL
    if (Object.keys(initial).length > 0) {
      setFilters(initial);
    } else {
      // Si no hay filtros en URL, hacer la búsqueda inicial
      fetchPackages();
    }
  }, []);

  // 🔹 Petición principal
  const fetchPackages = async (params = {}) => {
    try {
      setLoading(true);

      const apiFilters = {
        activo: true,
        visibleEnWeb: true,
      };

      if (filters.search) {
        apiFilters.$or = [
          { titulo: { $regex: filters.search, $options: "i" } },
          { "destinos.ciudad": { $regex: filters.search, $options: "i" } }
        ];
      }

      if (filters.tipo) apiFilters.tipo = filters.tipo;
      if (filters.etiqueta) apiFilters.etiquetas = filters.etiqueta;
      if (filters.maxPrecio) apiFilters.precioBase = { $lte: Number(filters.maxPrecio) };
      if (filters.minDias) apiFilters["destinos.diasEstadia"] = { $gte: Number(filters.minDias) };

      const queryParams = {
        sort: "-createdAt",
        filters: JSON.stringify(apiFilters),
        page: params.page || 1,
        limit: 12,
      };

      const response = await api.get("/packages", { params: queryParams });

      setPackages(response.data.items || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.error("❌ Error al cargar paquetes:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ejecutar búsqueda cuando cambien filtros
  useEffect(() => {
    // Solo ejecutar si filters tiene contenido (evita doble llamada inicial)
    if (Object.keys(filters).length > 0) {
      fetchPackages();
    }
  }, [filters]);

  const handleView = (id) => (window.location.href = `/paquetes/${id}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PackageCarousel />

      {/* Barra de filtros */}
      <PackageFilterBar filters={filters} onChange={setFilters} />

      {/* Filtros avanzados */}
      <PackageFilters filters={filters} onChange={setFilters} />

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">Cargando paquetes...</div>
      ) : packages.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay paquetes que coincidan con tu búsqueda.
        </p>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} onView={handleView} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-10 space-x-3">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchPackages({ page: i + 1 })}
                  className={`px-3 py-1 rounded ${
                    pagination.page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PackageListPage;