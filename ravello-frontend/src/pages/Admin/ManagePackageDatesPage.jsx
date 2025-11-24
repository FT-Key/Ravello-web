// src/pages/admin/PackageDates/ManagePackageDatesPage.jsx
import React, { useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import PackageDateFilterBar from "../../components/admin/PackageDateFilterBar";
import PackageDateEditModal from "../../components/admin/PackageDateEditModal";

import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

export default function ManagePackageDatesPage() {
  // -----------------------------------------------
  // 🟦 Hook reutilizable: datos + filtros + paginación
  // -----------------------------------------------
  const {
    data: dates,
    loading,
    page,
    limit,
    total,
    filters,
    setFilters,
    setPage,
    refetch,
  } = usePaginatedFetch("/package-dates");

  // -----------------------------------------------
  // 🔍 Búsqueda local dentro de lo que trajo el backend
  // -----------------------------------------------
  const [query, setQuery] = React.useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return dates;

    const q = query.toLowerCase();
    return dates.filter((d) =>
      Object.values(d).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [dates, query]);

  // -----------------------------------------------
  // 🟦 Modal de edición
  // -----------------------------------------------
  const [editing, setEditing] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    refetch(); // vuelve a cargar la página actual
    toast.success("Fecha guardada correctamente");
  };

  // -----------------------------------------------
  // 🗑 Eliminar
  // -----------------------------------------------
  const handleDelete = async (row) => {
    if (!confirm("¿Eliminar esta fecha de salida?")) return;

    try {
      await clientAxios.delete(`/package-dates/${row._id}`);
      toast.success("Fecha eliminada");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Error eliminando la fecha");
    }
  };

  // -----------------------------------------------
  // 📊 Columnas de la tabla
  // -----------------------------------------------
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
            className={`px-2 py-1 text-xs rounded ${val === "disponible"
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
      {
        key: "actions",
        label: "Acciones",
        render: (_, row) => (
          <div className="flex gap-2">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => handleEdit(row)}
            >
              Editar
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => handleDelete(row)}
            >
              Eliminar
            </button>
          </div>
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
          onClick={refetch}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      {/* Barra de filtros */}
      <PackageDateFilterBar
        onApply={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        onCreate={handleCreate}
      />

      {/* Tabla con paginación REAL */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Modal */}
      <PackageDateEditModal
        open={modalOpen}
        data={editing}
        onSaved={handleSaved}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
