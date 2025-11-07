import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function PackageModal({ open, onClose, pkg, onSaved }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "nacional",
    descripcionCorta: "",
    descripcionDetallada: "",
    precioBase: "",
    moneda: "ARS",
    montoSenia: "",
    plazoPagoTotalDias: 7,
    fechas: { salida: "", regreso: "" },
    imagenPrincipal: "",
    etiquetas: [],
    activo: true,
    visibleEnWeb: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pkg) setForm(pkg);
    else
      setForm({
        nombre: "",
        tipo: "nacional",
        descripcionCorta: "",
        descripcionDetallada: "",
        precioBase: "",
        moneda: "ARS",
        montoSenia: "",
        plazoPagoTotalDias: 7,
        fechas: { salida: "", regreso: "" },
        imagenPrincipal: "",
        publicado: true,
        etiquetas: [],
      });
  }, [pkg]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (key, subKey, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [subKey]: value },
    }));
  };

  const handleEtiquetaToggle = (etiqueta) => {
    setForm((prev) => {
      const etiquetas = prev.etiquetas.includes(etiqueta)
        ? prev.etiquetas.filter((e) => e !== etiqueta)
        : [...prev.etiquetas, etiqueta];
      return { ...prev, etiquetas };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.tipo) newErrors.tipo = "El tipo es obligatorio.";
    if (!form.precioBase || form.precioBase <= 0)
      newErrors.precioBase = "Debe ingresar un precio base válido.";
    if (!form.montoSenia || form.montoSenia <= 0)
      newErrors.montoSenia = "Debe ingresar una seña válida.";
    if (!form.imagenPrincipal.trim())
      newErrors.imagenPrincipal = "Debe subir una imagen principal.";
    if (form.descripcionCorta.length > 200)
      newErrors.descripcionCorta = "La descripción corta no puede superar los 200 caracteres.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const method = pkg ? "PUT" : "POST";
      const url = pkg ? `/api/packages/${pkg._id}` : "/api/packages";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar paquete");

      const saved = await res.json();
      onSaved(saved);
      toast.success(`Paquete ${pkg ? "actualizado" : "creado"} correctamente`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al guardar");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {pkg ? "Editar paquete" : "Nuevo paquete"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Nombre */}
          <div>
            <label className="block font-medium">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label className="block font-medium">Tipo *</label>
            <select
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
            {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block font-medium">Descripción corta (máx. 200)</label>
            <textarea
              rows={2}
              value={form.descripcionCorta}
              onChange={(e) => handleChange("descripcionCorta", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.descripcionCorta && <p className="text-red-500 text-sm">{errors.descripcionCorta}</p>}
          </div>

          {/* Descripción detallada */}
          <div>
            <label className="block font-medium">Descripción detallada</label>
            <textarea
              rows={4}
              value={form.descripcionDetallada}
              onChange={(e) => handleChange("descripcionDetallada", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Precio y moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Precio base *</label>
              <input
                type="number"
                value={form.precioBase}
                onChange={(e) => handleChange("precioBase", Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
              {errors.precioBase && <p className="text-red-500 text-sm">{errors.precioBase}</p>}
            </div>

            <div>
              <label className="block font-medium">Moneda</label>
              <select
                value={form.moneda}
                onChange={(e) => handleChange("moneda", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Seña y plazo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Monto de seña *</label>
              <input
                type="number"
                value={form.montoSenia}
                onChange={(e) => handleChange("montoSenia", Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
              {errors.montoSenia && <p className="text-red-500 text-sm">{errors.montoSenia}</p>}
            </div>
            <div>
              <label className="block font-medium">Plazo total (días)</label>
              <input
                type="number"
                value={form.plazoPagoTotalDias}
                onChange={(e) => handleChange("plazoPagoTotalDias", Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Fecha de salida</label>
              <input
                type="date"
                value={form.fechas.salida?.substring(0, 10) || ""}
                onChange={(e) => handleNestedChange("fechas", "salida", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Fecha de regreso</label>
              <input
                type="date"
                value={form.fechas.regreso?.substring(0, 10) || ""}
                onChange={(e) => handleNestedChange("fechas", "regreso", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block font-medium">URL de imagen principal *</label>
            <input
              type="text"
              value={form.imagenPrincipal}
              onChange={(e) => handleChange("imagenPrincipal", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.imagenPrincipal && <p className="text-red-500 text-sm">{errors.imagenPrincipal}</p>}
          </div>

          {/* Estado del paquete */}
          <div className="flex flex-col gap-2">
            <label className="block font-medium">Estado del paquete</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
              />
              <label>Activo (paquete disponible)</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.visibleEnWeb}
                onChange={(e) => handleChange("visibleEnWeb", e.target.checked)}
              />
              <label>Visible en la web</label>
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block font-medium">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["oferta", "nuevo", "mas vendido", "recomendado", "exclusivo"].map((etq) => (
                <button
                  key={etq}
                  type="button"
                  onClick={() => handleEtiquetaToggle(etq)}
                  className={`px-3 py-1 rounded-full border text-sm ${form.etiquetas.includes(etq)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-400 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {etq}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {pkg ? "Guardar cambios" : "Crear paquete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
