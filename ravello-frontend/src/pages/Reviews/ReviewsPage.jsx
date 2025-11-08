import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";

export default function ReviewsPage({ paqueteId = null }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      calificacion: 5,
      comentario: "",
      tipo: paqueteId ? "paquete" : "empresa",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = { ...data };
      if (paqueteId) payload.paquete = paqueteId;

      await clientAxios.post("/reviews", payload);

      toast.success("✅ ¡Gracias por tu reseña!");
      setSuccess(true);
      reset({
        nombre: "",
        calificacion: 5,
        comentario: "",
        tipo: paqueteId ? "paquete" : "empresa",
      });

      // Redirigir después de un pequeño delay
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al enviar la reseña. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-background-light min-h-screen">
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary-blue">
          Dejanos tu reseña
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block mb-1 font-semibold">Tu nombre</label>
            <input
              type="text"
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full border rounded-lg px-3 py-2"
              disabled={isSubmitting && success}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Calificación */}
          <div>
            <label className="block mb-1 font-semibold">Calificación</label>
            <select
              {...register("calificacion")}
              className="w-full border rounded-lg px-3 py-2"
              disabled={isSubmitting && success}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} estrella{n > 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          {/* Comentario */}
          <div>
            <label className="block mb-1 font-semibold">Comentario</label>
            <textarea
              {...register("comentario", {
                required: "El comentario es obligatorio",
                minLength: {
                  value: 5,
                  message: "El comentario debe tener al menos 5 caracteres",
                },
              })}
              rows={4}
              className="w-full border rounded-lg px-3 py-2"
              disabled={isSubmitting && success}
            />
            {errors.comentario && (
              <p className="text-red-500 text-sm mt-1">
                {errors.comentario.message}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isSubmitting || success}
            className={`w-full py-3 rounded-lg font-semibold transition-transform ${
              success
                ? "bg-green-500 cursor-not-allowed"
                : "bg-primary-red text-white hover:scale-105"
            }`}
          >
            {isSubmitting ? "Enviando..." : success ? "Enviado ✅" : "Enviar reseña"}
          </button>
        </form>
      </div>
    </section>
  );
}
