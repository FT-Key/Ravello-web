import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

export default function ManageUsersPage() {
  const { user } = useUserStore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Error cargando usuarios"));
  }, []);

  const handleEdit = (u) => {
    if (u._id === user._id) {
      toast.error("No puedes editarte a ti mismo");
      return;
    }
    toast("Función editar aún no implementada", { icon: "✏️" });
  };

  const handleDelete = async (u) => {
    if (u._id === user._id || u.esPrincipal) {
      toast.error("No puedes eliminar este usuario");
      return;
    }
    if (!confirm(`¿Eliminar usuario ${u.nombre}?`)) return;

    try {
      const res = await fetch(`/api/users/${u._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando usuario");
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
      toast.success(`Usuario "${u.nombre}" eliminado`);
    } catch {
      toast.error("Ocurrió un error al eliminar el usuario");
    }
  };

  const columns = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "rol", label: "Rol", sortable: true },
    { key: "activo", label: "Activo", render: (val) => (val ? "Sí" : "No") },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de usuarios</h1>
      <DataTable columns={columns} data={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
