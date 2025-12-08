import { useState, useEffect, useCallback } from "react";
import clientAxios from "../api/axiosConfig";

export const usePaginatedFetch = (endpoint, initialFilters = {}, defaultLimit = 10) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 🔥 buildParams DENTRO del useCallback
      const params = new URLSearchParams();

      // 🔥 Procesar filtros correctamente
      Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;

        if (key === "filters" && typeof value === "object") {
          // Si filters tiene propiedades, serializar
          if (Object.keys(value).length > 0) {
            params.append("filters", JSON.stringify(value));
          }
        } else {
          params.append(key, value);
        }
      });

      // 🔥 Agregar paginación
      params.append("page", page);
      params.append("limit", limit);

      const queryString = params.toString();
      /* console.log("🌐 Request URL:", `${endpoint}?${queryString}`); */

      const res = await clientAxios.get(`${endpoint}?${queryString}`);

      /* console.log("✅ Response:", res.data); */

      setData(res.data.data || res.data.items || res.data.results || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("[usePaginatedFetch] Error:", error);
      console.error("[usePaginatedFetch] Error details:", error.response?.data);
      
      // 🔥 Reset data en caso de error
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [endpoint, filters, page, limit]); // 🔥 Dependencias correctas

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    page,
    limit,
    total,
    filters,
    setPage,
    setLimit,
    setFilters,
    refetch: fetchData,
  };
};