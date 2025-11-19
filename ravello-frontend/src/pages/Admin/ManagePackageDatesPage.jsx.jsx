// src/pages/admin/PackageDates/ManagePackageDatesPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import PackageDateFilterBar from "../../components/admin/PackageDateFilterBar";
import PackageDateEditModal from "../../components/admin/PackageDateEditModal";

import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";
import { extractResponseArray } from "../../utils/extractResponseArray";

export default function ManagePackageDatesPage() {
  const [dates, setDates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    estado: "",
    moneda: "",
    packageId: ""
  });

  // ------------------------------------------------
  // 📦 Cargar fechas
  // ------------------------------------------------
  const loadDates = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams(filters);
      const res = await clientAxios.get(`/package-dates?${params}`);

      const arr = extractResponseArray(res, ["dates"]);
      setDates(arr);
      setFiltered(arr);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando fechas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDates();
  }, [filters]);

  // ------------------------------------------------
  // 🔍 Búsqueda
  // ------------------------------------------------
  useEffect(() => {
    let result = [...dates];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((d) =>
        Object.values(d).some((v) => String(v).toLowerCase().includes(q))
      );
    }

    setFiltered(result);
  }, [dates, query]);

  // ------------------------------------------------
  // Handlers
  // ------------------------------------------------
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = (saved) => {
    setDates((prev) => {
      const idx = prev.findIndex((d) => d._id === saved._id);
      if (idx >= 0) {
        const arr = [...prev];
        arr[idx] = saved;
        return arr;
      }
      return [saved, ...prev];
    });

    toast.success("Fecha guardada correctamente");
  };

  const handleDelete = async (row) => {
    if (!confirm("¿Eliminar esta fecha de salida?")) return;

    try {
      await clientAxios.delete(`/package-dates/${row._id}`);
      setDates((prev) => prev.filter((d) => d._id !== row._id));
      toast.success("Fecha eliminada");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al eliminar");
    }
  };

  // ------------------------------------------------
  // 📊 Columnas tabla
  // ------------------------------------------------
  const columns = useMemo(
    () => [
      {
        key: "package",
        label: "Paquete",
        render: (_, row) => row.package?.nombre || "—",
      },
      {
        key: "salida",
        label: "Salida",
        render: (v) => new Date(v).toLocaleDateString(),
      },
      {
        key: "regreso",
        label: "Regreso",
        render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
      },
      {
        key: "precioFinal",
        label: "Precio",
        render: (v, row) =>
          `${row.moneda || "ARS"} ${Number(v || 0).toLocaleString()}`,
      },
      {
        key: "cuposDisponibles",
        label: "Cupos",
        render: (_, row) =>
          `${row.cuposDisponibles}/${row.cuposTotales || "?"}`,
      },
      {
        key: "estado",
        label: "Estado",
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${
              val === "disponible"
                ? "bg-green-100 text-green-700"
                : val === "agotado"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {val}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Fechas de Paquetes</h1>

        <button
          onClick={loadDates}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      <PackageDateFilterBar
        query={query}
        setQuery={setQuery}
        onFilterChange={handleFilterChange}
        onCreate={handleCreate}
      />

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando fechas...</div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PackageDateEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}
