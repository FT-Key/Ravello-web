import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";

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
        descripcion: pkg.descripcion || "",
        descuentoNinos: pkg.descuentoNinos || 0,
        duracionTotal: pkg.duracionTotal || 0,
      });
    } else {
      reset({
        nombre: "",
        tipo: "nacional",
        descripcionCorta: "",
        descripcionDetallada: "",
        descripcion: "",
        precioBase: "",
        moneda: "ARS",
        montoSenia: "",
        plazoPagoTotalDias: 7,
        descuentoNinos: 0,
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
      const method = pkg ? "put" : "post";
      const url = pkg ? `/packages/${pkg._id}` : "/packages";

      const formData = new FormData();

      // Convertir campos dinámicamente
      Object.keys(data).forEach((key) => {
        if (key === "imagenPrincipal") return;
        if (key === "imagenes") return;

        if (["destinos", "traslado", "hospedaje", "actividades", "coordinadores"].includes(key)) {
          if (data[key] && (Array.isArray(data[key]) ? data[key].length > 0 : true)) {
            formData.append(key, JSON.stringify(data[key]));
          }
          return;
        }

        if (key === "duracionTotal") return;
        if (["createdAt", "updatedAt", "__v", "_id"].includes(key)) return;

        const value = data[key];

        if (key === "etiquetas") {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Imagen principal
      if (imagenPrincipalFile) {
        formData.append("imagenPrincipal", imagenPrincipalFile);
      }

      // Imágenes múltiples (archivos nuevos)
      imagenesFiles.forEach((file) => formData.append("imagenes", file));

      // Debug
      console.log("📤 DATA antes de enviar:", data);
      for (let pair of formData.entries()) {
        console.log("📦 FormData →", pair[0], ":", pair[1]);
      }

      // ----- 🚀 Enviar con Axios -----
      const { data: saved } = await clientAxios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSaved(saved);
      toast.success(`Paquete ${pkg ? "actualizado" : "creado"} correctamente`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Hubo un error al guardar el paquete");
    }
  };


  if (!open) return null;

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {pkg ? "Editar paquete" : "Nuevo paquete"}
            </h2>
            {pkg && (
              <p className="text-sm text-gray-500 mt-1">
                ID: {pkg._id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* INFORMACIÓN BÁSICA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Información Básica
            </h3>

            {/* NOMBRE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Paquete <span className="text-red-500">*</span>
              </label>
              <input
                {...register("nombre", { required: "El nombre es obligatorio" })}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Ej: Mendoza Aventura 5 días"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            {/* TIPO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                {...register("tipo")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="nacional">Nacional</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>

            {/* DESCRIPCIÓN CORTA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Corta (máx. 200 caracteres)
              </label>
              <textarea
                {...register("descripcionCorta", {
                  maxLength: { value: 200, message: "Máximo 200 caracteres" }
                })}
                rows={2}
                maxLength={200}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.descripcionCorta ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Breve descripción para listados..."
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{errors.descripcionCorta?.message || ""}</span>
                <span>{watch("descripcionCorta")?.length || 0}/200</span>
              </div>
            </div>

            {/* DESCRIPCIÓN DETALLADA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Detallada
              </label>
              <textarea
                {...register("descripcionDetallada")}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Descripción completa del paquete..."
              />
            </div>

            {/* DESCRIPCIÓN ADICIONAL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Adicional
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Información adicional..."
              />
            </div>
          </div>

          {/* PRECIOS Y PAGOS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Precios y Condiciones de Pago
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Base <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("precioBase", {
                    required: "El precio base es obligatorio",
                    min: { value: 0, message: "El precio no puede ser negativo" }
                  })}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.precioBase ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="0.00"
                />
                {errors.precioBase && (
                  <p className="text-red-500 text-sm mt-1">{errors.precioBase.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                <select
                  {...register("moneda")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="USD">USD - Dólar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descuento Niños (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("descuentoNinos", {
                    min: { value: 0, message: "No puede ser negativo" },
                    max: { value: 100, message: "No puede ser mayor a 100" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto de Seña <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("montoSenia", {
                    required: "El monto de seña es obligatorio",
                    min: { value: 0, message: "No puede ser negativo" }
                  })}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.montoSenia ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="0.00"
                />
                {errors.montoSenia && (
                  <p className="text-red-500 text-sm mt-1">{errors.montoSenia.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazo Pago Total (días)
                </label>
                <input
                  type="number"
                  {...register("plazoPagoTotalDias")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7"
                />
              </div>
            </div>
          </div>

          {/* IMÁGENES */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Imágenes
            </h3>

            {/* IMAGEN PRINCIPAL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen Principal <span className="text-red-500">*</span>
              </label>

              {pkg?.imagenPrincipal?.url && !imagenPrincipalFile && (
                <div className="mb-2">
                  <img
                    src={pkg.imagenPrincipal.url}
                    alt="Imagen principal actual"
                    className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Imagen actual</p>
                </div>
              )}

              {imagenPrincipalFile && (
                <div className="mb-2">
                  <img
                    src={URL.createObjectURL(imagenPrincipalFile)}
                    alt="Nueva imagen principal"
                    className="w-48 h-32 object-cover rounded-lg border border-green-500"
                  />
                  <p className="text-xs text-green-600 mt-1">Nueva imagen seleccionada</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagenPrincipalFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* IMÁGENES EXTRAS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes Adicionales
              </label>

              {pkg?.imagenes?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Imágenes actuales:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pkg.imagenes.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={`Imagen ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                    ))}
                  </div>
                </div>
              )}

              {imagenesFiles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-green-600 mb-2">Nuevas imágenes seleccionadas:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {imagenesFiles.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt={`Nueva imagen ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-green-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              <input
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setImagenesFiles(Array.from(e.target.files))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* ETIQUETAS Y ESTADO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Etiquetas y Configuración
            </h3>

            {/* ETIQUETAS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {["oferta", "nuevo", "mas vendido", "recomendado", "exclusivo"].map(
                  (etq) => (
                    <button
                      key={etq}
                      type="button"
                      onClick={() => toggleEtiqueta(etq)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${etiquetas.includes(etq)
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                        }`}
                    >
                      {etq}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ESTADO */}
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("activo")}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Activo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("visibleEnWeb")}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Visible en Web</span>
              </label>
            </div>
          </div>

          {pkg?.duracionTotal !== undefined && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Duración Total:</strong> {pkg.duracionTotal} días (calculado automáticamente según destinos)
              </p>
            </div>
          )}

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              {pkg ? "Guardar Cambios" : "Crear Paquete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}