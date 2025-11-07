import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import PackageEditModal from "../../components/admin/PackageEditModal";
import PackageFilterBar from "../../components/admin/PackageFilterBar";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

export default function ManagePackagesPage() {
  const { user } = useUserStore();
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ tipo: "", publicado: "" });

  // 📦 Cargar paquetes desde API
  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Error al cargar paquetes");
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
      setFiltered(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando paquetes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // 🔍 Aplicar búsqueda y filtros
  useEffect(() => {
    let result = [...packages];

    // Búsqueda global
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        Object.values(p).some((v) => String(v).toLowerCase().includes(q))
      );
    }

    // Filtro por tipo
    if (filters.tipo) {
      result = result.filter((p) => p.tipo === filters.tipo);
    }

    // Filtro por estado de publicación
    if (filters.publicado) {
      const isPublished = filters.publicado === "true";
      result = result.filter((p) => p.publicado === isPublished);
    }

    setFiltered(result);
  }, [packages, query, filters]);

  // 🧩 Handlers de eventos
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleEdit = (pkg) => {
    setEditing(pkg);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSaved = (saved) => {
    setPackages((prev) => {
      const idx = prev.findIndex((p) => p._id === saved._id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success("Paquete guardado correctamente");
  };

  const handleDelete = async (pkg) => {
    if (pkg.publicado) {
      toast.error("No puedes eliminar un paquete publicado. Despublicalo primero.");
      return;
    }
    if (!confirm(`¿Eliminar el paquete "${pkg.nombre}"?`)) return;

    try {
      const res = await fetch(`/api/packages/${pkg._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando paquete");
      setPackages((prev) => prev.filter((x) => x._id !== pkg._id));
      toast.success(`Paquete "${pkg.nombre}" eliminado`);
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al eliminar el paquete");
    }
  };

  // 📊 Columnas de la tabla
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
        key: "publicado",
        label: "Publicado",
        render: (val) => (
          <span
            className={`px-2 py-1 text-xs rounded ${val
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            {val ? "Sí" : "No"}
          </span>
        ),
      },
      {
        key: "fechas",
        label: "Fechas",
        render: (val) =>
          val?.salida && val?.regreso
            ? `${new Date(val.salida).toLocaleDateString()} → ${new Date(
              val.regreso
            ).toLocaleDateString()}`
            : "No definidas",
      },
    ],
    []
  );

  // 🧱 Render principal
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Paquetes</h1>
        <button
          onClick={loadPackages}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      {/* Filtros */}
      <PackageFilterBar
        query={query}
        setQuery={setQuery}
        onCreate={handleCreate}
        onFilterChange={handleFilterChange}
      />

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Cargando paquetes...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal de edición / creación */}
      <PackageEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        pkg={editing}
        onSave={handleSaved}
      />
    </div>
  );
}
