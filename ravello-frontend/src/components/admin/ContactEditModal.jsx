import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ContactEditModal({ isOpen, onClose, contact, onSave }) {
  const [leido, setLeido] = useState(false);

  useEffect(() => {
    if (contact) setLeido(contact.leido);
  }, [contact]);

  if (!isOpen || !contact) return null;

  const handleSave = async () => {
    try {
      await fetch(`/api/contacts/${contact._id}/read`, {
        method: "PATCH",
      });

      onSave({ ...contact, leido: true }); // Backend siempre marca como leído
      toast.success("Mensaje marcado como leído");
      onClose();
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error("No se pudo actualizar el mensaje");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Editar estado del mensaje
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Nombre:</strong> {contact.nombre}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {contact.email}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Asunto:</strong> {contact.asunto || "—"}
            </p>
          </div>

          <label className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={leido}
              onChange={(e) => setLeido(e.target.checked)}
              className="h-5 w-5 accent-blue-600"
            />
            <span className="text-gray-800 dark:text-gray-100">
              Marcar como leído
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
