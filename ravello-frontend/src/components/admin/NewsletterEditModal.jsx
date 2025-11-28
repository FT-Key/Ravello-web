import React, { useState, useEffect } from "react";
import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";

export default function NewsletterEditModal({ open, onClose, item, onSaved }) {
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setEmail(item.email || "");
      setActive(item.active === true);
    } else {
      setEmail("");
      setActive(true);
    }
  }, [item]);

  const handleSave = async () => {
    setSaving(true);

    try {
      if (item) {
        // 🔥 USAR PATCH CORRECTO
        await clientAxios.patch(`/newsletter/${item._id}/status`, {
          active,
        });
      } else {
        // CREAR NUEVO
        await clientAxios.post(`/newsletter`, {
          email,
          active,
        });
      }

      toast.success("Guardado correctamente");
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar cambios");
    }

    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">

        <h2 className="text-xl font-bold mb-4">
          {item ? "Editar suscripción" : "Nueva suscripción"}
        </h2>

        <label className="block mb-3">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className={`border w-full px-3 py-2 rounded mt-1 ${
              item ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={email}
            disabled={!!item}
            onChange={(e) => !item && setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">Estado</span>
          <select
            className="border w-full px-3 py-2 rounded mt-1"
            value={active ? "true" : "false"}
            onChange={(e) => setActive(e.target.value === "true")}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>

      </div>
    </div>
  );
}
