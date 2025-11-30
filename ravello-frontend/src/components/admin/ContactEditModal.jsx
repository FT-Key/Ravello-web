import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";

export default function ContactEditModal({ isOpen, onClose, contact, onSave }) {
  const [leido, setLeido] = useState(false);

  useEffect(() => {
    if (contact) setLeido(contact.leido);
  }, [contact]);

  if (!isOpen || !contact) return null;

  const handleSave = async () => {
    try {
      await clientAxios.patch(`/contacts/${contact._id}/read`);

      onSave({ ...contact, leido: true });
      toast.success("Mensaje marcado como leído");
      onClose();
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error("No se pudo actualizar el mensaje");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              📧 Mensaje de Contacto
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Estado visual */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
              {contact.leido ? (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Leído
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                  </svg>
                  No leído
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(contact.createdAt).toLocaleString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Información del remitente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                👤 Nombre
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                {contact.nombre}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                📧 Email
              </label>
              <a
                href={`mailto:${contact.email}`}
                className="block text-blue-600 hover:text-blue-700 bg-gray-50 px-3 py-2 rounded border hover:bg-blue-50 transition"
              >
                {contact.email}
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                📞 Teléfono
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                {contact.telefono || "No proporcionado"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                📝 Asunto
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                {contact.asunto || "Sin asunto"}
              </p>
            </div>
          </div>

          {/* Mensaje completo */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              💬 Mensaje
            </label>
            <div className="bg-gray-50 border rounded-lg p-4 min-h-[120px] max-h-[300px] overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {contact.mensaje}
              </p>
            </div>
          </div>

          {/* Metadata técnica */}
          {(contact.ip || contact.userAgent) && (
            <div className="pt-4 border-t">
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-700 font-medium">
                  🔍 Información técnica
                </summary>
                <div className="mt-2 space-y-1 pl-4">
                  {contact.ip && <p>IP: {contact.ip}</p>}
                  {contact.userAgent && (
                    <p className="break-all">User-Agent: {contact.userAgent}</p>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* Checkbox para marcar como leído */}
          {!contact.leido && (
            <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition">
              <input
                type="checkbox"
                checked={leido}
                onChange={(e) => setLeido(e.target.checked)}
                className="h-5 w-5 accent-blue-600 cursor-pointer"
              />
              <span className="text-gray-800 font-medium">
                Marcar como leído
              </span>
            </label>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 transition"
          >
            Cerrar
          </button>
          
          {!contact.leido && (
            <button
              onClick={handleSave}
              disabled={!leido}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg text-white transition ${
                leido
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}