// src/pages/Packages/PackageListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";
import PackageCard from "../../components/packages/PackageCard";
import PackageFilterBar from "../../components/packages/PackageFilterBar";
import PackageFilters from "../../components/packages/PackageFilters";
import PackageCarousel from "../../components/packages/PackageCarousel";
import { getQueryParams } from "../../utils/getQueryParams";

const PackageListPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Pre cargar filtros desde la URL
  useEffect(() => {
    const params = getQueryParams();
    const initial = {};

    if (params.destino) initial.search = params.destino;
    if (params.search) initial.search = params.search;
    if (params.tipo) initial.tipo = params.tipo;
    if (params.etiqueta) initial.etiqueta = params.etiqueta;

    if (Object.keys(initial).length > 0) {
      setFilters(initial);
    } else {
      fetchPackages();
    }
  }, []);

  // Petición principal
  const fetchPackages = async (params = {}) => {
    try {
      setLoading(true);

      const apiFilters = {
        activo: true,
        visibleEnWeb: true,
      };

      // Búsqueda por texto (nombre o ciudad)
      if (filters.search) {
        apiFilters.$or = [
          { nombre: { $regex: filters.search, $options: "i" } },
          { "destinos.ciudad": { $regex: filters.search, $options: "i" } },
        ];
      }

      // Filtro por tipo (nacional/internacional)
      if (filters.tipo) {
        apiFilters.tipo = filters.tipo;
      }

      // Filtro por etiqueta
      if (filters.etiqueta) {
        apiFilters.etiquetas = filters.etiqueta;
      }

      // Filtro por precio máximo
      if (filters.maxPrecio) {
        apiFilters.precioBase = { $lte: Number(filters.maxPrecio) };
      }

      // Filtro por duración mínima
      if (filters.minDias) {
        apiFilters.duracionTotal = { $gte: Number(filters.minDias) };
      }

      // Filtro por ciudad
      if (filters.ciudad) {
        apiFilters["destinos.ciudad"] = { $regex: filters.ciudad, $options: "i" };
      }

      // Filtro por pensión
      if (filters.pension) {
        apiFilters.$or = [
          { "hospedaje.gastronomia.pension": filters.pension },
          { "destinos.hospedaje.gastronomia.pension": filters.pension },
        ];
      }

      // Filtro por categoría de hotel
      if (filters.categoria) {
        apiFilters.$or = [
          { "hospedaje.categoria": filters.categoria },
          { "destinos.hospedaje.categoria": filters.categoria },
        ];
      }

      const queryParams = {
        sort: "-createdAt",
        filters: JSON.stringify(apiFilters),
        page: params.page || 1,
        limit: 12,
      };

      const response = await clientAxios.get("/packages", { params: queryParams });

      setPackages(response.data.items || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.error("❌ Error al cargar paquetes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar búsqueda cuando cambien filtros
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchPackages();
    }
  }, [filters]);

  const handleView = (id) => {
    navigate(`/paquetes/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 no-select">
      <PackageCarousel />

      {/* Barra de filtros */}
      <div className="no-select">
        <PackageFilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Filtros avanzados */}
      <div className="no-select">
        <PackageFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12 no-select">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando paquetes...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg no-select">
          <p className="text-gray-500 text-lg">
            No hay paquetes que coincidan con tu búsqueda.
          </p>
          <button
            onClick={() => setFilters({})}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium no-select"
          >
            Limpiar todos los filtros
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 no-select">
            Mostrando {packages.length} de {pagination.total || packages.length} paquetes
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg._id} className="no-select">
                <PackageCard pkg={pkg} onView={handleView} />
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-10 space-x-3 no-select">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchPackages({ page: i + 1 })}
                  className={`px-3 py-1 rounded no-select ${pagination.page === i + 1
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
