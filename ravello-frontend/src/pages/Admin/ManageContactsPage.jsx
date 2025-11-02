import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { toast } from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";

export default function ManageContactsPage() {
  const { user } = useUserStore(); // por si luego agregas permisos por rol
  const [contacts, setContacts] = useState([]);

  // --- Cargar mensajes ---
  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => {
        console.error("Error cargando mensajes:", err);
        toast.error("Error cargando mensajes");
      });
  }, []);

  // --- Marcar como leído ---
  const handleMarkRead = async (msg) => {
    try {
      await fetch(`/api/contacts/${msg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leido: !msg.leido })
      });
      setContacts((prev) =>
        prev.map((x) =>
          x._id === msg._id ? { ...x, leido: !x.leido } : x
        )
      );
      toast.success(`Mensaje marcado como ${msg.leido ? "no leído" : "leído"}`);
    } catch (err) {
      console.error("Error actualizando mensaje:", err);
      toast.error("No se pudo actualizar el mensaje");
    }
  };

  // --- Eliminar mensaje ---
  const handleDelete = async (msg) => {
    if (!confirm(`¿Eliminar el mensaje de ${msg.nombre}?`)) return;
    try {
      await fetch(`/api/contacts/${msg._id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((x) => x._id !== msg._id));
      toast.success("Mensaje eliminado");
    } catch (err) {
      console.error("Error eliminando mensaje:", err);
      toast.error("No se pudo eliminar el mensaje");
    }
  };

  // --- Columnas para DataTable ---
  const columns = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "telefono", label: "Teléfono" },
    { key: "asunto", label: "Asunto", sortable: true },
    {
      key: "mensaje",
      label: "Mensaje",
      render: (_, row) => row.resumen || row.mensaje.slice(0, 50) + "..."
    },
    {
      key: "leido",
      label: "Leído",
      render: (val) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            val ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
          }`}
        >
          {val ? "Sí" : "No"}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Fecha",
      sortable: true,
      render: (val) => new Date(val).toLocaleString()
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de contactos</h1>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        onEdit={handleMarkRead} // reutilizamos para marcar leído/no leído
        onDelete={handleDelete}
      />
    </div>
  );
}
