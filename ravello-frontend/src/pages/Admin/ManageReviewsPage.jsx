import React, { useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import ReviewFilterBar from "../../components/admin/ReviewFilterBar";
import ReviewEditModal from "../../components/admin/ReviewEditModal";
import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

export default function ManageReviewsPage() {
  // -----------------------------------------------
  // 🟦 Hook reutilizable: datos + filtros + paginación
  // -----------------------------------------------
  const {
    data: reviews,
    loading,
    page,
    limit,
    total,
    setFilters,
    setPage,
    refetch,
  } = usePaginatedFetch("/reviews");

  // -----------------------------------------------
  // 🟦 Modal de edición
  // -----------------------------------------------
  const [editReview, setEditReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (review) => {
    setEditReview(review);
    setModalOpen(true);
  };

  const handleSaved = async (payload) => {
    try {
      await clientAxios.put(`/reviews/${editReview._id}/moderar`, payload);

      // Actualizar tabla y notificar
      refetch();
      toast.success("Reseña actualizada correctamente");

      // Cerrar modal
      setModalOpen(false);
      setEditReview(null);
    } catch (error) {
      toast.error("Error al actualizar reseña");
    }
  };

  // -----------------------------------------------
  // 🗑 Eliminar
  // -----------------------------------------------
  const handleDelete = async (review) => {
    if (!confirm(`¿Eliminar reseña de ${review.nombre}?`)) return;

    try {
      await clientAxios.delete(`/reviews/${review._id}`);
      toast.success("Reseña eliminada correctamente");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar reseña");
    }
  };

  // -----------------------------------------------
  // ✅ Moderar
  // -----------------------------------------------
  const handleModerate = async (id, estado) => {
    try {
      await clientAxios.put(`/reviews/${id}/moderar`, { estado });
      toast.success(`Reseña ${estado}`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Error al moderar reseña");
    }
  };

  // -----------------------------------------------
  // 📊 Columnas de la tabla
  // -----------------------------------------------
  const columns = useMemo(
    () => [
      { key: "nombre", label: "Autor" },
      { key: "tipo", label: "Tipo" },
      {
        key: "paquete",
        label: "Paquete / Empresa",
        render: (val, row) =>
          row.tipo === "paquete" ? val?.nombre || "-" : "Empresa",
      },
      {
        key: "comentario",
        label: "Comentario",
        render: (val) =>
          val?.slice(0, 50) + (val?.length > 50 ? "..." : ""),
      },
      {
        key: "calificacion",
        label: "⭐ Puntuación",
        render: (val) => `${val}/5`,
      },
      {
        key: "estadoModeracion",
        label: "Estado",
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${val === "pendiente"
                ? "bg-yellow-100 text-yellow-700"
                : val === "aprobada"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {val === "pendiente"
              ? "🕓 Pendiente"
              : val === "aprobada"
                ? "✅ Aprobada"
                : "❌ Rechazada"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Reseñas</h1>
        <button
          onClick={refetch}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      {/* Barra de filtros */}
      <ReviewFilterBar
        onApply={(payload) => {
          console.log("🔍 Aplicando filtros:", payload);
          setFilters(payload);
          setPage(1);
        }}
      />

      {/* Tabla con paginación REAL */}
      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraActions={(row) => (
          <div className="flex gap-2">
            {row.estadoModeracion !== "aprobada" && (
              <button
                onClick={() => handleModerate(row._id, "aprobada")}
                className="text-green-600 hover:underline"
              >
                Aprobar
              </button>
            )}
            {row.estadoModeracion !== "rechazada" && (
              <button
                onClick={() => handleModerate(row._id, "rechazada")}
                className="text-red-600 hover:underline"
              >
                Rechazar
              </button>
            )}
          </div>
        )}
      />

      {/* Modal */}
      <ReviewEditModal
        open={modalOpen}
        review={editReview}
        onClose={() => {
          setModalOpen(false);
          setEditReview(null);
        }}
        onSave={handleSaved}
      />
    </div>
  );
}