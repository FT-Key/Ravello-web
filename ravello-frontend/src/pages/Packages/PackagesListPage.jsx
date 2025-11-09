// src/pages/Packages/PackageListPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axiosConfig";
import PackageCard from "../../components/packages/PackageCard";
import PackageFilterBar from "../../components/packages/PackageFilterBar";
import PackageFilters from "../../components/packages/PackageFilters";
import PackageCarousel from "../../components/packages/PackageCarousel";

const normalizeText = (text) => {
  if (!text) return "";
  return text
    .normalize("NFD") // separa acentos del carácter base
    .replace(/[\u0300-\u036f]/g, "") // elimina los diacríticos
    .toLowerCase()
    .trim();
};

const PackageListPage = () => {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("/packages");
        setPackages(response.data || []);
      } catch (err) {
        console.error("Error al cargar paquetes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Filtrado local
  const filteredPackages = useMemo(() => {
    const normalizedSearch = normalizeText(filters.search);

    return packages.filter((pkg) => {
      const pkgNombre = normalizeText(pkg.nombre);
      const pkgTipo = normalizeText(pkg.tipo);
      const pkgEtiquetas = pkg.etiquetas?.map(normalizeText) || [];
      const pkgDestinos =
        pkg.destinos?.map((d) => normalizeText(d.ciudad)) || [];

      const matchSearch =
        !normalizedSearch ||
        pkgNombre.includes(normalizedSearch) ||
        pkgDestinos.some((d) => d.includes(normalizedSearch));

      const matchTipo =
        !filters.tipo || pkgTipo === normalizeText(filters.tipo);
      const matchEtiqueta =
        !filters.etiqueta ||
        pkgEtiquetas.includes(normalizeText(filters.etiqueta));
      const matchMaxPrecio =
        !filters.maxPrecio || pkg.precioBase <= Number(filters.maxPrecio);
      const matchMinDias =
        !filters.minDias ||
        pkg.destinos?.some((d) => d.diasEstadia >= Number(filters.minDias));

      return (
        matchSearch &&
        matchTipo &&
        matchEtiqueta &&
        matchMaxPrecio &&
        matchMinDias
      );
    });
  }, [packages, filters]);

  const handleView = (id) => (window.location.href = `/packages/${id}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Carousel */}
      <PackageCarousel />

      {/* Barra de filtros */}
      <PackageFilterBar filters={filters} onChange={setFilters} />

      {/* Filtros avanzados */}
      <PackageFilters filters={filters} onChange={setFilters} />

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">Cargando paquetes...</div>
      ) : filteredPackages.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay paquetes que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} onView={handleView} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageListPage;
