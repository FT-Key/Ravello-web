// src/pages/Packages/PackageListPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import PackageCard from "../../components/packages/PackageCard";
import PackageFilterBar from "../../components/packages/PackageFilterBar";
import PackageFilters from "../../components/packages/PackageFilters";
import PackageCarousel from "../../components/packages/PackageCarousel";

const PackageListPage = () => {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

 const fetchPackages = async (params = {}) => {
  try {
    setLoading(true);

    // 🔹 Construimos filtros dinámicos para el middleware query
    const apiFilters = {
      activo: true,
      visibleEnWeb: true,
    };

    if (filters.tipo) apiFilters.tipo = filters.tipo;
    if (filters.etiqueta) apiFilters.etiquetas = filters.etiqueta;
    if (filters.maxPrecio) apiFilters.precioBase = { $lte: Number(filters.maxPrecio) };
    if (filters.minDias) apiFilters["destinos.diasEstadia"] = { $gte: Number(filters.minDias) };

    console.log("API: ", apiFilters)
    // 🔹 Armamos los parámetros de consulta
    const queryParams = {
      sort: "-createdAt", // o "precioBase" si querés ordenar por precio
      filters: JSON.stringify(apiFilters),
      page: params.page || 1,
      limit: 12,
    };

    // 🧠 LOGS DE DEPURACIÓN
    console.groupCollapsed("📦 [fetchPackages] Petición al backend");
    console.log("🧩 Filtros construidos:", apiFilters);
    console.log("📤 Parámetros de consulta (queryParams):", queryParams);

    // Si tu cliente Axios está configurado con una baseURL, mostrará la URL completa:
    const queryString = new URLSearchParams(queryParams).toString();
    console.log(`🌐 URL completa: ${api.defaults.baseURL}/packages?${queryString}`);
    console.groupEnd();

    // 🔹 Hacemos la petición
    const response = await api.get("/packages", { params: queryParams });

    // 🔹 LOGS DE RESPUESTA
    console.groupCollapsed("✅ [fetchPackages] Respuesta del backend");
    console.log("📦 Items:", response.data.items);
    console.log("📊 Paginación:", response.data.pagination);
    console.log("🔍 Status:", response.status);
    console.groupEnd();

    // 🔹 Actualizamos el estado
    setPackages(response.data.items || []);
    setPagination(response.data.pagination || {});
  } catch (err) {
    console.error("❌ Error al cargar paquetes:", err);
    if (err.response) {
      console.error("🧾 Respuesta del servidor:", err.response.data);
      console.error("📡 Código de estado:", err.response.status);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const handleView = (id) => (window.location.href = `/packages/${id}`);

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

          {/* 🔹 Paginación simple */}
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
