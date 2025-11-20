import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import clientAxios from "../../api/axiosConfig";
import { toast } from "react-hot-toast";

export default function PackageDateEditModal({ open, onClose, data, onSaved }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      package: "",
      salida: "",
      precioFinal: "",
      moneda: "ARS",
      cuposTotales: 0,
      cuposDisponibles: 0,
      estado: "disponible",
      notas: "",
    },
  });

  // Cargar todos los paquetes al montar el componente
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const res = await clientAxios.get("/packages");
        console.log("res: ",res)
        setPackages(res.data.items || []);
      } catch (error) {
        console.error("Error cargando paquetes:", error);
        toast.error("Error al cargar los paquetes");
      } finally {
        setLoadingPackages(false);
      }
    };

    if (open) {
      fetchPackages();
    }
  }, [open]);

  // Cargar datos cuando es edición
  useEffect(() => {
    if (data && open) {
      reset({
        package: data.package?._id || "",
        salida: data.salida ? new Date(data.salida).toISOString().substring(0, 10) : "",
        precioFinal: data.precioFinal || "",
        moneda: data.moneda || "ARS",
        cuposTotales: data.cuposTotales || 0,
        cuposDisponibles: data.cuposDisponibles || 0,
        estado: data.estado || "disponible",
        notas: data.notas || "",
      });
    } else if (open) {
      // Reset al crear uno nuevo
      reset({
        package: "",
        salida: "",
        precioFinal: "",
        moneda: "ARS",
        cuposTotales: 0,
        cuposDisponibles: 0,
        estado: "disponible",
        notas: "",
      });
    }
  }, [data, open, reset]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      let res;

      if (data?._id) {
        // Editar fecha existente
        res = await clientAxios.put(`/package-dates/${data._id}`, formData);
        toast.success("Fecha actualizada correctamente");
      } else {
        // Crear nueva fecha
        res = await clientAxios.post(`/package-dates`, formData);
        toast.success("Fecha creada correctamente");
      }
console.log('RESPUESTA: ', res)
      onSaved(res.data.data);
      onClose();
    } catch (err) {
      console.error("Error guardando fecha:", err);
      const errorMsg = err.response?.data?.message || "Error guardando fecha";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    handleSubmit(onSubmit)();
  };

  if (!open) return null;

  const selectedPackage = packages.find(
    (p) => p._id === watch("package")
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {data ? "Editar Fecha de Salida" : "Crear Nueva Fecha de Salida"}
          </h2>
          {data && (
            <p className="text-sm text-gray-500 mt-1">
              ID: {data._id}
            </p>
          )}
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Selección de paquete */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paquete <span className="text-red-500">*</span>
              </label>
              {loadingPackages ? (
                <div className="w-full border px-3 py-2 rounded bg-gray-50 text-gray-500">
                  Cargando paquetes...
                </div>
              ) : (
                <>
                  <select
                    {...register("package", {
                      required: "Debes seleccionar un paquete",
                    })}
                    className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.package ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Seleccionar paquete...</option>
                    {packages.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre} - {p.tipo} ({p.duracionTotal || 0} días)
                      </option>
                    ))}
                  </select>
                  {errors.package && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.package.message}
                    </p>
                  )}
                  {selectedPackage && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                      <p className="font-medium text-blue-900">
                        {selectedPackage.nombre}
                      </p>
                      <p className="text-blue-700 mt-1">
                        Duración: {selectedPackage.duracionTotal || 0} días | 
                        Precio base: {selectedPackage.moneda} ${selectedPackage.precioBase?.toLocaleString()}
                      </p>
                      {selectedPackage.descripcionCorta && (
                        <p className="text-blue-600 text-xs mt-1">
                          {selectedPackage.descripcionCorta}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fecha de salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Salida <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("salida", {
                  required: "La fecha de salida es obligatoria",
                })}
                className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salida ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.salida && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.salida.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                La fecha de regreso se calculará automáticamente según la duración del paquete
              </p>
            </div>

            {/* Precio y moneda */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Final
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("precioFinal", {
                    min: { value: 0, message: "El precio no puede ser negativo" },
                  })}
                  className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.precioFinal ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.precioFinal && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.precioFinal.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <select
                  {...register("moneda")}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Cupos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cupos Totales
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("cuposTotales", {
                    min: { value: 0, message: "No puede ser negativo" },
                    valueAsNumber: true,
                  })}
                  className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cuposTotales ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cuposTotales && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cuposTotales.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cupos Disponibles
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("cuposDisponibles", {
                    min: { value: 0, message: "No puede ser negativo" },
                    valueAsNumber: true,
                  })}
                  className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cuposDisponibles ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cuposDisponibles && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cuposDisponibles.message}
                  </p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                {...register("estado")}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <textarea
                {...register("notas")}
                placeholder="Información adicional sobre esta fecha..."
                rows="3"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || loadingPackages}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}