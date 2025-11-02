import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { useUserStore } from "../../stores/useUserStore";

export default function ManageUsersPage() {
  const { user } = useUserStore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleEdit = (u) => {
    if (u._id === user._id) return alert("No puedes editarte a ti mismo aquí.");
    // abrir modal o redirigir a formulario
  };

  const handleDelete = (u) => {
    if (u._id === user._id || u.esPrincipal)
      return alert("No puedes eliminar este usuario.");
    if (!confirm(`¿Eliminar usuario ${u.nombre}?`)) return;
    fetch(`/api/users/${u._id}`, { method: "DELETE" })
      .then(() => setUsers((prev) => prev.filter((x) => x._id !== u._id)));
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
