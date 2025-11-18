import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

export default function PackageModal({ open, onClose, pkg, onSaved }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // 🎯 ARCHIVOS SELECCIONADOS
  const [imagenPrincipalFile, setImagenPrincipalFile] = useState(null);
  const [imagenesFiles, setImagenesFiles] = useState([]);

  // ----------------------------------------------------
  // 📌 RESET CUANDO EDITÁS
  // ----------------------------------------------------
  useEffect(() => {
    if (pkg) {
      reset({
        ...pkg,
        descripcionCorta: pkg.descripcionCorta || "",
        descripcionDetallada: pkg.descripcionDetallada || "",
        fechas: {
          salida: pkg?.fechas?.salida ? pkg.fechas.salida.slice(0, 10) : "",
          regreso: pkg?.fechas?.regreso ? pkg.fechas.regreso.slice(0, 10) : "",
        },
      });
    } else {
      reset({
        nombre: "",
        tipo: "nacional",
        descripcionCorta: "",
        descripcionDetallada: "",
        precioBase: "",
        moneda: "ARS",
        montoSenia: "",
        plazoPagoTotalDias: 7,
        fechas: { salida: "", regreso: "" },
        etiquetas: [],
        activo: true,
        visibleEnWeb: true,
      });
    }

    setImagenPrincipalFile(null);
    setImagenesFiles([]);
  }, [pkg, reset]);

  const etiquetas = watch("etiquetas") || [];

  // ----------------------------------------------------
  // CAMBIAR ETIQUETAS
  // ----------------------------------------------------
  const toggleEtiqueta = (etq) => {
    const nuevas = etiquetas.includes(etq)
      ? etiquetas.filter((x) => x !== etq)
      : [...etiquetas, etq];

    setValue("etiquetas", nuevas);
  };

  // ----------------------------------------------------
  // 📌 SUBMIT → ENVIO FORM-DATA
  // ----------------------------------------------------
  const onSubmit = async (data) => {
    try {
      const method = pkg ? "PUT" : "POST";
      const url = pkg ? `/api/packages/${pkg._id}` : "/api/packages";

      const formData = new FormData();

      // Convertir campos dinámicamente
      Object.keys(data).forEach((key) => {
        if (key === "fechas") return;
        if (key === "etiquetas") return;

        // ❌ No enviar imagenPrincipal si es URL
        if (key === "imagenPrincipal") return;

        // ❌ No enviar imagenes si vienen del backend (urls)
        if (key === "imagenes") return;

        const value = data[key];

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Fechas
      formData.append("fechas", JSON.stringify(data.fechas));

      // Etiquetas
      formData.append("etiquetas", JSON.stringify(data.etiquetas));

      // Imagen principal
      if (imagenPrincipalFile) {
        formData.append("imagenPrincipal", imagenPrincipalFile);
      }

      // Imágenes múltiples (archivos nuevos)
      imagenesFiles.forEach((file) =>
        formData.append("imagenes", file)
      );

      // Log para debug
      console.log("📤 DATA antes de enviar:", data);
      for (let pair of formData.entries()) {
        console.log("📦 FormData →", pair[0], ":", pair[1]);
      }

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) throw new Error("Error al guardar paquete");

      const saved = await res.json();
      onSaved(saved);
      toast.success(`Paquete ${pkg ? "actualizado" : "creado"} correctamente`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al guardar el paquete");
    }
  };

  if (!open) return null;

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {pkg ? "Editar paquete" : "Nuevo paquete"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {/* NOMBRE */}
          <div>
            <label className="font-medium">Nombre *</label>
            <input
              {...register("nombre", { required: true })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* TIPO */}
          <div>
            <label className="font-medium">Tipo *</label>
            <select {...register("tipo")} className="w-full border rounded px-3 py-2">
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>

          {/* DESCRIPCIÓN CORTA */}
          <div>
            <label className="font-medium">Descripción corta</label>
            <textarea
              {...register("descripcionCorta")}
              rows={2}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* DESCRIPCIÓN DETALLADA */}
          <div>
            <label className="font-medium">Descripción detallada</label>
            <textarea
              {...register("descripcionDetallada")}
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* PRECIO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Precio base *</label>
              <input
                type="number"
                {...register("precioBase", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label>Moneda</label>
              <select {...register("moneda")} className="w-full border rounded px-3 py-2">
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* SEÑA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Monto de seña *</label>
              <input
                type="number"
                {...register("montoSenia", { required: true })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label>Plazo total (días)</label>
              <input
                type="number"
                {...register("plazoPagoTotalDias")}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* FECHAS */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="fechas.salida"
              render={({ field }) => (
                <div>
                  <label>Salida</label>
                  <input
                    type="date"
                    {...field}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="fechas.regreso"
              render={({ field }) => (
                <div>
                  <label>Regreso</label>
                  <input
                    type="date"
                    {...field}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
            />
          </div>

          {/* IMAGEN PRINCIPAL */}
          <div>
            <label className="font-medium">Imagen principal *</label>

            {pkg?.imagenPrincipal?.url && !imagenPrincipalFile && (
              <img
                src={pkg.imagenPrincipal.url}
                className="w-32 h-20 object-cover rounded mb-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagenPrincipalFile(e.target.files[0])}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* IMÁGENES EXTRAS */}
          <div>
            <label className="font-medium">Imágenes adicionales</label>

            <input
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => setImagenesFiles(Array.from(e.target.files))}
              className="w-full border rounded px-3 py-2"
            />

            {pkg?.imagenes?.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {pkg.imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    className="w-24 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* ETIQUETAS */}
          <div>
            <label className="font-medium">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["oferta", "nuevo", "mas vendido", "recomendado", "exclusivo"].map(
                (etq) => (
                  <button
                    key={etq}
                    type="button"
                    onClick={() => toggleEtiqueta(etq)}
                    className={`px-3 py-1 rounded-full border text-sm ${etiquetas.includes(etq)
                      ? "bg-blue-600 text-white"
                      : "border-gray-400 text-gray-700"
                      }`}
                  >
                    {etq}
                  </button>
                )
              )}
            </div>
          </div>

          {/* ESTADO */}
          <div className="flex gap-3 items-center">
            <input type="checkbox" {...register("activo")} />
            <span>Activo</span>

            <input type="checkbox" {...register("visibleEnWeb")} />
            <span>Visible en web</span>
          </div>

          {/* BOTONES */}
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
