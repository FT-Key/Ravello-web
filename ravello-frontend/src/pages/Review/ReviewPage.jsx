// src/components/reviews/ReviewForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import api from "../../api/axiosConfig";

const ReviewForm = ({ packageId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitMessage, setSubmitMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      calificacion: 0,
      comentario: "",
    },
  });

  const calificacion = watch("calificacion");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      const reviewData = {
        ...data,
        ...(packageId && { paquete: packageId }),
        tipo: packageId ? "paquete" : "empresa",
        estadoModeracion: "pendiente",
      };

      await api.post("/reviews", reviewData);

      setSubmitMessage({
        type: "success",
        text: "¡Gracias por tu opinión! Tu reseña será publicada una vez aprobada.",
      });

      reset();
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      setSubmitMessage({
        type: "error",
        text: "Hubo un error al enviar tu opinión. Por favor, intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setValue("calificacion", star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={32}
            className={`${star <= (hoveredStar || calificacion)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
              } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-background-light py-16 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-background-white shadow-xl rounded-2xl p-8 md:p-10">

        {/* Título */}
        <h2 className="text-3xl font-semibold text-primary-blue text-center mb-2">
          Comparte tu experiencia
        </h2>
        <p className="text-dark text-center mb-8">
          Tu opinión ayuda a otros viajeros.
        </p>

        {/* Mensaje de estado */}
        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm font-medium ${submitMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Nombre */}
          <div>
            <label className="text-dark font-medium mb-1 block">Nombre</label>
            <input
              type="text"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
              })}
              placeholder="Tu nombre"
              className="w-full p-3 rounded-lg border border-subtle bg-background-white text-dark
              focus:ring-2 focus:ring-primary-blue focus:outline-none"
            />
            {errors.nombre && (
              <p className="text-primary-red text-sm">{errors.nombre.message}</p>
            )}
          </div>

          {/* Calificación */}
          <div className="flex flex-col">
            <label className="text-dark font-medium mb-2">Calificación</label>

            <input
              type="hidden"
              {...register("calificacion", {
                required: "Selecciona una calificación",
                min: { value: 1, message: "Selecciona al menos 1 estrella" },
              })}
            />

            {renderStars()}

            {errors.calificacion && (
              <p className="text-primary-red text-sm mt-2">
                {errors.calificacion.message}
              </p>
            )}

            {calificacion > 0 && (
              <p className="text-light text-sm mt-1">
                Seleccionaste {calificacion}{" "}
                {calificacion === 1 ? "estrella" : "estrellas"}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div>
            <label className="text-dark font-medium mb-1 block">
              Tu opinión (opcional)
            </label>
            <textarea
              rows="4"
              {...register("comentario", {
                maxLength: {
                  value: 500,
                  message: "Máximo 500 caracteres",
                },
              })}
              placeholder="Escribe tu experiencia..."
              className="w-full p-3 rounded-lg border border-subtle bg-background-white text-dark resize-none
              focus:ring-2 focus:ring-primary-blue focus:outline-none"
            />
            {errors.comentario && (
              <p className="text-primary-red text-sm mt-1">{errors.comentario.message}</p>
            )}
            <p className="text-light text-xs mt-1">
              {watch("comentario")?.length || 0} / 500 caracteres
            </p>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all
              ${isSubmitting
                ? "bg-primary-blue/50 cursor-not-allowed"
                : "bg-primary-blue hover:bg-primary-blue/80"
              }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar opinión"}
          </button>

          <p className="text-light text-xs text-center">
            Las opiniones son moderadas antes de publicarse.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
