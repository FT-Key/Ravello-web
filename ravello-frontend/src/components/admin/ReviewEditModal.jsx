import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

export default function ReviewEditModal({ open, review, onClose, onSave }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: "",
      comentario: "",
      calificacion: 0,
      estadoModeracion: "pendiente",
    },
  });

  useEffect(() => {
    if (review) reset(review);
  }, [review, reset]);

  if (!open || !review) return null;

  const onSubmit = (data) => {
    // Solo enviamos el nuevo estado
    onSave({ estadoModeracion: data.estadoModeracion });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Moderar reseña</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre (solo lectura) */}
          <div>
            <label className="block text-sm font-medium mb-1">Autor</label>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <input {...field} className="w-full border p-2 rounded bg-gray-100" disabled />
              )}
            />
          </div>

          {/* Comentario (solo lectura) */}
          <div>
            <label className="block text-sm font-medium mb-1">Comentario</label>
            <Controller
              name="comentario"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border p-2 rounded bg-gray-100 min-h-[100px]"
                  disabled
                />
              )}
            />
          </div>

          {/* Puntuación (solo lectura) */}
          <div>
            <label className="block text-sm font-medium mb-1">Calificación</label>
            <Controller
              name="calificacion"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  className="w-full border p-2 rounded bg-gray-100"
                  disabled
                />
              )}
            />
          </div>

          {/* Estado editable */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado de moderación</label>
            <Controller
              name="estadoModeracion"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full border p-2 rounded">
                  <option value="pendiente">🕓 Pendiente</option>
                  <option value="aprobada">✅ Aprobada</option>
                  <option value="rechazada">❌ Rechazada</option>
                </select>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
