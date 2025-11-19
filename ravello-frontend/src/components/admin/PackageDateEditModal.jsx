// src/components/admin/PackageDateEditModal.jsx
import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";

export default function PackageDateEditModal({ open, onClose, data, onSaved }) {
  const [form, setForm] = useState({
    package: "",
    salida: "",
    precioFinal: "",
    moneda: "ARS",
    cuposTotales: 0,
    cuposDisponibles: 0,
    estado: "disponible",
    notas: "",
  });

  const [packages, setPackages] = useState([]);

  // Cargar todos los paquetes
  useEffect(() => {
    clientAxios.get("/packages").then((res) => {
      setPackages(res.data.packages || []);
    });
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (data) {
      setForm({
        package: data.package?._id || "",
        salida: data.salida?.substring(0, 10) || "",
        precioFinal: data.precioFinal || "",
        moneda: data.moneda || "ARS",
        cuposTotales: data.cuposTotales || 0,
        cuposDisponibles: data.cuposDisponibles || 0,
        estado: data.estado || "disponible",
        notas: data.notas || "",
      });
    }
  }, [data]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      let res;

      if (data?._id) {
        res = await clientAxios.put(`/package-dates/${data._id}`, form);
      } else {
        res = await clientAxios.post(`/package-dates`, form);
      }

      onSaved(res.data.packageDate);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error guardando fecha");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          {data ? "Editar fecha" : "Crear fecha"}
        </h2>

        <div className="space-y-3">
          <select
            value={form.package}
            onChange={(e) => handleChange("package", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Seleccionar paquete...</option>
            {packages.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.salida}
            onChange={(e) => handleChange("salida", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Precio final"
            value={form.precioFinal}
            onChange={(e) => handleChange("precioFinal", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={form.moneda}
            onChange={(e) => handleChange("moneda", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>

          <input
            type="number"
            placeholder="Cupos totales"
            value={form.cuposTotales}
            onChange={(e) => handleChange("cuposTotales", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Cupos disponibles"
            value={form.cuposDisponibles}
            onChange={(e) => handleChange("cuposDisponibles", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={form.estado}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <textarea
            placeholder="Notas"
            value={form.notas}
            onChange={(e) => handleChange("notas", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
