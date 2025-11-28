import React, { useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import UserEditModal from "../../components/admin/UserEditModal";
import UserFilterBar from "../../components/admin/UserFilterBar";
import { toast } from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

export default function ManageUsersPage() {
  // -----------------------------------------------
  // 🟦 Hook reutilizable: datos + filtros + paginación
  // -----------------------------------------------
  const {
    data: users,
    loading,
    page,
    limit,
    total,
    setFilters,
    setPage,
    refetch,
  } = usePaginatedFetch("/users");

  // -----------------------------------------------
  // 🟦 Modal de edición
  // -----------------------------------------------
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (user) => {
    setEditing(user);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    refetch(); // vuelve a cargar la página actual
    toast.success("Usuario guardado correctamente");
  };

  // -----------------------------------------------
  // 🗑 Eliminar
  // -----------------------------------------------
  const handleDelete = async (user) => {
    if (user.esPrincipal) {
      toast.error("No puedes eliminar el usuario principal.");
      return;
    }
    if (!confirm(`¿Eliminar el usuario "${user.nombre}"?`)) return;

    try {
      await clientAxios.delete(`/users/${user._id}`);
      toast.success(`Usuario "${user.nombre}" eliminado`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al eliminar el usuario");
    }
  };

  // -----------------------------------------------
  // 📊 Columnas tabla
  // -----------------------------------------------
  const columns = useMemo(
    () => [
      { key: "nombre", label: "Nombre", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { 
        key: "rol", 
        label: "Rol", 
        sortable: true,
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${
              val === "admin"
                ? "bg-purple-100 text-purple-700"
                : val === "editor"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </span>
        ),
      },
      {
        key: "activo",
        label: "Estado",
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${
              val
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {val ? "Activo" : "Inactivo"}
          </span>
        ),
      },
      {
        key: "esPrincipal",
        label: "Principal",
        render: (val) =>
          val ? (
            <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
              ⭐ Principal
            </span>
          ) : null,
      },
      {
        key: "createdAt",
        label: "Fecha de registro",
        render: (val) =>
          val ? new Date(val).toLocaleDateString() : "—",
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
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={refetch}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      {/* Barra de filtros */}
      <UserFilterBar
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
        data={users}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <UserEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}