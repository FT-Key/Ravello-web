import React, { useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import ContactEditModal from "../../components/admin/ContactEditModal";
import ContactFilterBar from "../../components/admin/ContactFilterBar";
import { toast } from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

export default function ManageContactsPage() {
  // -----------------------------------------------
  // 🟦 Hook reutilizable: datos + filtros + paginación
  // -----------------------------------------------
  const {
    data: contacts,
    loading,
    page,
    limit,
    total,
    setFilters,
    setPage,
    refetch,
  } = usePaginatedFetch("/contacts");

  // -----------------------------------------------
  // 🟦 Modal de vista/edición
  // -----------------------------------------------
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (updated) => {
    try {
      // Marcar como leído si es necesario
      if (!selectedContact.leido && updated.leido) {
        await clientAxios.patch(`/contacts/${updated._id}/mark-read`);
      }
      
      refetch(); // Recargar datos
      toast.success("Mensaje actualizado correctamente");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error actualizando mensaje:", err);
      toast.error("Error al actualizar el mensaje");
    }
  };

  // -----------------------------------------------
  // 🗑 Eliminar
  // -----------------------------------------------
  const handleDelete = async (msg) => {
    if (!confirm(`¿Eliminar el mensaje de ${msg.nombre}?`)) return;

    try {
      await clientAxios.delete(`/contacts/${msg._id}`);
      toast.success(`Mensaje de "${msg.nombre}" eliminado`);
      refetch();
    } catch (err) {
      console.error("❌ Error eliminando mensaje:", err);
      toast.error("No se pudo eliminar el mensaje");
    }
  };

  // -----------------------------------------------
  // ✅ Marcar como leído rápidamente
  // -----------------------------------------------
  const handleMarkAsRead = async (msg) => {
    if (msg.leido) return; // Ya está leído

    try {
      await clientAxios.patch(`/contacts/${msg._id}/read`);
      toast.success("Mensaje marcado como leído");
      refetch();
    } catch (err) {
      console.error("❌ Error marcando como leído:", err);
      toast.error("Error al marcar como leído");
    }
  };

  // -----------------------------------------------
  // 📊 Columnas tabla
  // -----------------------------------------------
  const columns = useMemo(
    () => [
      { 
        key: "nombre", 
        label: "Nombre", 
        sortable: true,
        render: (val, row) => (
          <div className="flex items-center gap-2">
            {!row.leido && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" title="No leído"></span>
            )}
            <span className={!row.leido ? "font-semibold" : ""}>{val}</span>
          </div>
        ),
      },
      { key: "email", label: "Email", sortable: true },
      { 
        key: "telefono", 
        label: "Teléfono",
        render: (val) => val || "—",
      },
      { 
        key: "asunto", 
        label: "Asunto", 
        sortable: true,
        render: (val) => val || "Sin asunto",
      },
      {
        key: "mensaje",
        label: "Mensaje",
        render: (val) => (
          <div className="max-w-xs truncate" title={val}>
            {val.slice(0, 60)}...
          </div>
        ),
      },
      {
        key: "leido",
        label: "Estado",
        render: (val, row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAsRead(row);
            }}
            disabled={val}
            className={`px-2 py-1 text-xs rounded transition ${
              val
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer"
            }`}
          >
            {val ? "✓ Leído" : "Marcar leído"}
          </button>
        ),
      },
      {
        key: "createdAt",
        label: "Fecha",
        sortable: true,
        render: (val) => new Date(val).toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ],
    []
  );

  // -----------------------------------------------
  // Render
  // -----------------------------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Mensajes de Contacto</h1>
        <button
          onClick={refetch}
          className="border px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Recargar
        </button>
      </div>

      {/* Barra de filtros */}
      <ContactFilterBar
        onApply={(payload) => {
          console.log("🔍 Aplicando filtros:", payload);
          setFilters(payload);
          setPage(1);
        }}
      />

      {/* Tabla con paginación REAL */}
      <DataTable
        columns={columns}
        data={contacts}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onEdit={handleView}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <ContactEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  );
}