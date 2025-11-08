import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function UserEditModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "cliente",
    activo: true,
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        rol: user.rol || "cliente",
        activo: user.activo ?? true,
        password: "",
      });
    }
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Editar usuario</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="border rounded-md w-full px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md w-full px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="border rounded-md w-full px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="activo"
              name="activo"
              type="checkbox"
              checked={formData.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo" className="text-sm">
              Usuario activo
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium">Nueva contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="(Opcional)"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-md w-full px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
