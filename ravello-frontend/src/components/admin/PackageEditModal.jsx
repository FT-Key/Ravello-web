import React, { useEffect } from "react";
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
  } = useForm({
    defaultValues: {
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
    },
  });

  // 🔧 Resetear valores cuando cambia pkg
  useEffect(() => {
    if (pkg) {
      reset({
        ...pkg,
        fechas: {
          salida: pkg?.fechas?.salida
            ? pkg.fechas.salida.slice(0, 10)
            : "",
          regreso: pkg?.fechas?.regreso
            ? pkg.fechas.regreso.slice(0, 10)
            : "",
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
        imagenPrincipal: "",
        etiquetas: [],
        activo: true,
        visibleEnWeb: true,
      });
    }
  }, [pkg, reset]);

  const etiquetas = watch("etiquetas");

  const toggleEtiqueta = (etiqueta) => {
    const actuales = etiquetas || [];
    const nuevas = actuales.includes(etiqueta)
      ? actuales.filter((e) => e !== etiqueta)
      : [...actuales, etiqueta];
    setValue("etiquetas", nuevas);
  };

  const onSubmit = async (data) => {
    try {
      const method = pkg ? "PUT" : "POST";
      const url = pkg ? `/api/packages/${pkg._id}` : "/api/packages";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {/* Nombre */}
          <div>
            <label className="block font-medium">Nombre *</label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio." })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm">{errors.nombre.message}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block font-medium">Tipo *</label>
            <select
              {...register("tipo", { required: "El tipo es obligatorio." })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-sm">{errors.tipo.message}</p>
            )}
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block font-medium">
              Descripción corta (máx. 200)
            </label>
            <textarea
              {...register("descripcionCorta", {
                maxLength: {
                  value: 200,
                  message:
                    "La descripción corta no puede superar los 200 caracteres.",
                },
              })}
              rows={2}
              className="w-full border rounded px-3 py-2"
            />
            {errors.descripcionCorta && (
              <p className="text-red-500 text-sm">
                {errors.descripcionCorta.message}
              </p>
            )}
          </div>

          {/* Descripción detallada */}
          <div>
            <label className="block font-medium">Descripción detallada</label>
            <textarea
              {...register("descripcionDetallada")}
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Precio y moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Precio base *</label>
              <input
                type="number"
                {...register("precioBase", {
                  required: "Debe ingresar un precio base válido.",
                  min: { value: 1, message: "El precio debe ser mayor a 0." },
                })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.precioBase && (
                <p className="text-red-500 text-sm">
                  {errors.precioBase.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium">Moneda</label>
              <select
                {...register("moneda")}
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
                {...register("montoSenia", {
                  required: "Debe ingresar una seña válida.",
                  min: { value: 1, message: "Debe ser mayor a 0." },
                })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.montoSenia && (
                <p className="text-red-500 text-sm">
                  {errors.montoSenia.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium">Plazo total (días)</label>
              <input
                type="number"
                {...register("plazoPagoTotalDias")}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="fechas.salida"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block font-medium">Fecha de salida</label>
                  <input
                    type="date"
                    {...field}
                    value={field.value ? field.value.slice(0, 10) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
            />
            <Controller
              name="fechas.regreso"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block font-medium">Fecha de regreso</label>
                  <input
                    type="date"
                    {...field}
                    value={field.value ? field.value.slice(0, 10) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block font-medium">URL de imagen principal *</label>
            <input
              {...register("imagenPrincipal", {
                required: "Debe subir una imagen principal.",
              })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.imagenPrincipal && (
              <p className="text-red-500 text-sm">
                {errors.imagenPrincipal.message}
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-2">
            <label className="block font-medium">Estado del paquete</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("activo")} />
              <label>Activo (paquete disponible)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("visibleEnWeb")} />
              <label>Visible en la web</label>
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block font-medium">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["oferta", "nuevo", "mas vendido", "recomendado", "exclusivo"].map(
                (etq) => (
                  <button
                    key={etq}
                    type="button"
                    onClick={() => toggleEtiqueta(etq)}
                    className={`px-3 py-1 rounded-full border text-sm ${etiquetas?.includes(etq)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-400 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {etq}
                  </button>
                )
              )}
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
