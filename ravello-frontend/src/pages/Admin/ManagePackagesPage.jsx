import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

export default function ManagePackagesPage() {
  const { user } = useUserStore();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => toast.error("Error cargando paquetes"));
  }, []);

  const handleEdit = (pkg) => {
    toast("Función editar aún no implementada", { icon: "✏️" });
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
      toast.error("Ocurrió un error al eliminar el paquete");
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "tipo", label: "Tipo", sortable: true },
    {
      key: "precioBase",
      label: "Precio",
      sortable: true,
      render: (val, row) => `${row.moneda} ${val.toLocaleString()}`,
    },
    {
      key: "publicado",
      label: "Publicado",
      render: (val) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            val ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
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
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de paquetes</h1>
        <button
          onClick={() => toast("Función crear paquete aún no implementada", { icon: "➕" })}
          className="bg-[var(--color-primary-blue)] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Nuevo paquete
        </button>
      </div>

      <DataTable
        columns={columns}
        data={packages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
