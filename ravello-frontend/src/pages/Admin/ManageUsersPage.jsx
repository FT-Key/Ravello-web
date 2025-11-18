import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import UserFilterBar from "../../components/admin/UserFilterBar";
import UserEditModal from "../../components/admin/UserEditModal";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";

// 🆕 utils
import { extractResponseArray } from "../../utils/extractResponseArray";

export default function ManageUsersPage() {
  const { user } = useUserStore();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ rol: "", activo: "" });
  const [editUser, setEditUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ---------------------------------------------------
  // 🔥 Ahora usando extractResponseArray()
  // ---------------------------------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await clientAxios.get("/users");

        const usersArray = extractResponseArray(res, ["users"]);

        setUsers(usersArray);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        toast.error("Error cargando usuarios");
      }
    };

    fetchUsers();
  }, []);
  // ---------------------------------------------------

  const handleEdit = (u) => {
    setEditUser(u);
    setModalOpen(true);
  };

  const handleDelete = async (u) => {
    if (!confirm(`¿Eliminar usuario ${u.nombre}?`)) return;

    try {
      await clientAxios.delete(`/users/${u._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
      toast.success(`Usuario "${u.nombre}" eliminado`);
    } catch {
      toast.error("Ocurrió un error al eliminar el usuario");
    }
  };

  const handleSave = async (data) => {
    try {
      const res = await clientAxios.put(`/users/${editUser._id}`, data);

      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? res.data : u))
      );

      toast.success("Usuario actualizado correctamente");
      setModalOpen(false);
    } catch {
      toast.error("Error al actualizar usuario");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      !query ||
      u.nombre?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase());

    const matchesRol = !filters.rol || u.rol === filters.rol;

    const matchesActivo =
      filters.activo === "" ? true : String(u.activo) === filters.activo;

    return matchesQuery && matchesRol && matchesActivo;
  });

  const columns = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "rol", label: "Rol", sortable: true },
    {
      key: "activo",
      label: "Activo",
      render: (val) => (val ? "✅ Sí" : "❌ No"),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de usuarios</h1>

      <UserFilterBar
        query={query}
        setQuery={setQuery}
        onFilterChange={handleFilterChange}
        onCreate={() => toast("Función crear usuario aún no implementada")}
      />

      <DataTable
        columns={columns}
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserEditModal
        open={modalOpen}
        user={editUser}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
