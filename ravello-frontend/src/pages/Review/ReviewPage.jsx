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
        ...(packageId && { paquete: packageId }), // solo si hay packageId
        tipo: packageId ? "paquete" : "empresa",   // tipo según contexto
        estadoModeracion: "pendiente",
      };

      await api.post("/reviews", reviewData);

      setSubmitMessage({
        type: "success",
        text: "¡Gracias por tu opinión! Tu reseña será publicada una vez aprobada por nuestro equipo.",
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
    <div className="flex gap-2">
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
            className={`${
              star <= (hoveredStar || calificacion)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-background-light p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-dark mb-4">
        Comparte tu experiencia
      </h3>

      {submitMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Tu nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
            placeholder="Escribe tu nombre"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        {/* Calificación */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Calificación <span className="text-red-500">*</span>
          </label>
          <input
            type="hidden"
            {...register("calificacion", {
              required: "Debes seleccionar una calificación",
              min: { value: 1, message: "Selecciona al menos 1 estrella" },
            })}
          />
          {renderStars()}
          {errors.calificacion && (
            <p className="mt-2 text-sm text-red-600">{errors.calificacion.message}</p>
          )}
          {calificacion > 0 && (
            <p className="mt-2 text-sm text-light">
              Has seleccionado {calificacion}{" "}
              {calificacion === 1 ? "estrella" : "estrellas"}
            </p>
          )}
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Tu opinión (opcional)
          </label>
          <textarea
            {...register("comentario", {
              maxLength: {
                value: 500,
                message: "El comentario no puede superar los 500 caracteres",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all resize-none"
            rows={4}
            placeholder="Cuéntanos sobre tu experiencia..."
          />
          {errors.comentario && (
            <p className="mt-1 text-sm text-red-600">{errors.comentario.message}</p>
          )}
          <p className="mt-1 text-xs text-light">
            {watch("comentario")?.length || 0} / 500 caracteres
          </p>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar opinión"}
        </button>

        <p className="text-xs text-light text-center">
          Tu opinión será revisada antes de ser publicada
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;
