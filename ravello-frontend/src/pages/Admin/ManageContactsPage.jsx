import React, { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { toast } from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";
import ContactEditModal from "../../components/admin/ContactEditModal";
import clientAxios from "../../api/axiosConfig";

// 🆕 Import utils
import { extractResponseArray } from "../../utils/extractResponseArray";

export default function ManageContactsPage() {
  const { user } = useUserStore(); 
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await clientAxios.get("/contacts");

      const parsed = extractResponseArray(response, ["contacts"]);
      setContacts(parsed);

    } catch (err) {
      console.error("❌ Error cargando mensajes:", err);
      toast.error("Error cargando mensajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (updated) => {
    setContacts((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };

  const handleDelete = async (msg) => {
    if (!confirm(`¿Eliminar el mensaje de ${msg.nombre}?`)) return;
    try {
      await clientAxios.delete(`/contacts/${msg._id}`);

      setContacts((prev) => prev.filter((x) => x._id !== msg._id));
      toast.success("Mensaje eliminado");
    } catch (err) {
      console.error("❌ Error eliminando mensaje:", err);
      toast.error("No se pudo eliminar el mensaje");
    }
  };

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

      {loading ? (
        <p className="text-gray-500">Cargando mensajes...</p>
      ) : (
        <DataTable
          columns={columns}
          data={contacts}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <ContactEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  );
}
