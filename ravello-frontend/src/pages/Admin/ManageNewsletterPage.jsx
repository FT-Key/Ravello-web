import React, { useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import NewsletterFilterBar from "../../components/admin/NewsletterFilterBar";
import NewsletterEditModal from "../../components/admin/NewsletterEditModal";
import { toast } from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

export default function ManageNewsletterPage() {
  const {
    data: emails,
    loading,
    page,
    limit,
    total,
    setFilters,
    setPage,
    refetch,
  } = usePaginatedFetch("/newsletter");

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    refetch();
    toast.success("Elemento guardado correctamente");
  };

  const handleDelete = async (item) => {
    if (!confirm(`¿Eliminar "${item.email}"?`)) return;

    try {
      await clientAxios.delete(`/newsletter/${item._id}`);
      toast.success(`"${item.email}" eliminado`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar");
    }
  };

  const columns = useMemo(
    () => [
      { key: "email", label: "Correo", sortable: true },

      {
        key: "active",
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
        key: "createdAt",
        label: "Fecha suscripción",
        render: (val) =>
          val ? new Date(val).toLocaleDateString() : "—",
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Newsletter - Suscriptores</h1>
        <button
          onClick={refetch}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      <NewsletterFilterBar
        onApply={(payload) => {
          setFilters(payload);
          setPage(1);
        }}
        onCreate={handleCreate}
      />

      <DataTable
        columns={columns}
        data={emails}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NewsletterEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}
