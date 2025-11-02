import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import DataTable from "../../components/admin/DataTable";

export default function ManageReviewsPage() {
  const { user } = useUserStore();
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
      setFiltered(data);
    } catch (err) {
      toast.error("Error al cargar reseñas");
    }
  };

  // Filtro por búsqueda y tipo
  useEffect(() => {
    const searchLower = search.toLowerCase();
    let result = reviews.filter(
      (r) =>
        r.nombre.toLowerCase().includes(searchLower) ||
        r.comentario?.toLowerCase().includes(searchLower)
    );
    if (filterTipo !== "todos") {
      result = result.filter((r) => r.tipo === filterTipo);
    }
    setFiltered(result);
  }, [search, filterTipo, reviews]);

  const toggleVisible = async (id, visible) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !visible }),
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, visible: !visible } : r))
      );
      toast.success(`Reseña ${visible ? "ocultada" : "visible"} correctamente`);
    } catch {
      toast.error("Error al cambiar visibilidad");
    }
  };

  const deleteReview = async (review) => {
    try {
      await fetch(`/api/reviews/${review._id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
      toast.success("Reseña eliminada");
    } catch {
      toast.error("Error al eliminar reseña");
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "calificacion", label: "Calificación" },
    { key: "comentario", label: "Comentario" },
    { key: "tipo", label: "Tipo" },
    {
      key: "paquete",
      label: "Paquete",
      render: (val) => val?.nombre || "—",
    },
    {
      key: "visible",
      label: "Visible",
      render: (_, row) => (
        <span className={row.visible ? "text-green-600" : "text-gray-500"}>
          {row.visible ? "Sí" : "No"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de reseñas</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="todos">Todos los tipos</option>
          <option value="empresa">Empresa</option>
          <option value="paquete">Paquete</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onEdit={(row) => toggleVisible(row._id, row.visible)}
        onDelete={(row) => deleteReview(row)}
      />
    </div>
  );
}
