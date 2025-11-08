import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import ReviewFilterBar from "../../components/admin/ReviewFilterBar";
import ReviewEditModal from "../../components/admin/ReviewEditModal";
import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ tipo: "", estado: "" });
  const [editReview, setEditReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams(filters);
      const { data } = await clientAxios.get(`/reviews?${params}`);
      setReviews(data);
    } catch {
      toast.error("Error cargando reseñas");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const handleEdit = (r) => {
    setEditReview(r);
    setModalOpen(true);
  };

  const handleDelete = async (r) => {
    if (!confirm(`¿Eliminar reseña de ${r.nombre}?`)) return;
    try {
      await clientAxios.delete(`/reviews/${r._id}`);
      setReviews((prev) => prev.filter((x) => x._id !== r._id));
      toast.success("Reseña eliminada correctamente");
    } catch {
      toast.error("Error al eliminar reseña");
    }
  };

  const handleSave = async (data) => {
    try {
      const res = await clientAxios.put(`/reviews/${editReview._id}`, data);
      setReviews((prev) =>
        prev.map((r) => (r._id === editReview._id ? res.data : r))
      );
      toast.success("Reseña actualizada correctamente");
      setModalOpen(false);
    } catch {
      toast.error("Error al actualizar reseña");
    }
  };

  const handleModerate = async (id, estado) => {
    try {
      const res = await clientAxios.patch(`/reviews/${id}/moderar`, { estado });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? res.data : r))
      );
      toast.success(`Reseña ${estado}`);
    } catch {
      toast.error("Error al moderar reseña");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesQuery =
      !query ||
      r.nombre?.toLowerCase().includes(query.toLowerCase()) ||
      r.comentario?.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  // 🔧 columnas adaptadas al esquema real
  const columns = [
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
      render: (val) => val?.slice(0, 50) + (val?.length > 50 ? "..." : ""),
    },
    {
      key: "calificacion",
      label: "⭐ Puntuación",
      render: (val) => `${val}/5`,
    },
    {
      key: "estadoModeracion",
      label: "Estado",
      render: (val) =>
        val === "pendiente"
          ? "🕓 Pendiente"
          : val === "aprobada"
          ? "✅ Aprobada"
          : "❌ Rechazada",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de reseñas</h1>

      <ReviewFilterBar
        query={query}
        setQuery={setQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <DataTable
        columns={columns}
        data={filteredReviews}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraActions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleModerate(row._id, "aprobada")}
              className="text-green-600 hover:underline"
            >
              Aprobar
            </button>
            <button
              onClick={() => handleModerate(row._id, "rechazada")}
              className="text-red-600 hover:underline"
            >
              Rechazar
            </button>
          </div>
        )}
      />

      <ReviewEditModal
        open={modalOpen}
        review={editReview}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
