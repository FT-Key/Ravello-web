import React, { useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import PackageEditModal from "../../components/admin/PackageEditModal";
import PackageFilterBar from "../../components/admin/PackageFilterBar";
import { toast } from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

export default function ManagePackagesPage() {
  // -----------------------------------------------
  // 🟦 Hook reutilizable: datos + filtros + paginación
  // -----------------------------------------------
  const {
    data: packages,
    loading,
    page,
    limit,
    total,
    setFilters,
    setPage,
    refetch,
  } = usePaginatedFetch("/packages");

  // -----------------------------------------------
  // 🟦 Modal de edición
  // -----------------------------------------------
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (pkg) => {
    setEditing(pkg);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    refetch(); // vuelve a cargar la página actual
    toast.success("Paquete guardado correctamente");
  };

  // -----------------------------------------------
  // 🗑 Eliminar
  // -----------------------------------------------
  const handleDelete = async (pkg) => {
    if (pkg.visibleEnWeb) {
      toast.error("No puedes eliminar un paquete visible en la web. Ocúltalo primero.");
      return;
    }
    if (!confirm(`¿Eliminar el paquete "${pkg.nombre}"?`)) return;

    try {
      await clientAxios.delete(`/packages/${pkg._id}`);
      toast.success(`Paquete "${pkg.nombre}" eliminado`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al eliminar el paquete");
    }
  };

  // -----------------------------------------------
  // 📊 Columnas tabla
  // -----------------------------------------------
  const columns = useMemo(
    () => [
      { key: "nombre", label: "Nombre", sortable: true },
      { key: "tipo", label: "Tipo", sortable: true },
      {
        key: "precioBase",
        label: "Precio",
        sortable: true,
        render: (val, row) =>
          `${row.moneda || "ARS"} ${Number(val || 0).toLocaleString()}`,
      },
      {
        key: "visibleEnWeb",
        label: "Visible en web",
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${
              val
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {val ? "Sí" : "No"}
          </span>
        ),
      },
      {
        key: "activo",
        label: "Activo",
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${
              val
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {val ? "Activo" : "Dado de baja"}
          </span>
        ),
      },
      {
        key: "fechas",
        label: "Fechas",
        render: (_, row) =>
          row.salida && row.regreso
            ? `${new Date(row.salida).toLocaleDateString()} → ${new Date(row.regreso).toLocaleDateString()}`
            : "No definidas",
      },
    ],
    []
  );

  // -----------------------------------------------
  // Render
  // -----------------------------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Paquetes</h1>
        <button
          onClick={refetch}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      {/* Barra de filtros */}
      <PackageFilterBar
        onApply={(payload) => {
          console.log("🔍 Aplicando filtros:", payload);
          setFilters(payload);
          setPage(1);
        }}
        onCreate={handleCreate}
      />

      {/* Tabla con paginación REAL */}
      <DataTable
        columns={columns}
        data={packages}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <PackageEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        pkg={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}