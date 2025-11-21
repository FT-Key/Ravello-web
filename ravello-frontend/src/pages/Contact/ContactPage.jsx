import React, { useState } from "react";
import { useForm } from "react-hook-form";
import clientAxios from "../../api/axiosConfig.js";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setErrorMsg("");
    try {
      await clientAxios.post("/contacts", {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        mensaje: data.mensaje,
        asunto: data.asunto || "General",
      });

      setSubmitted(true);
      reset();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.error || "Ocurrió un error al enviar el mensaje."
      );
    }
  };

  return (
    <div className="w-full bg-background-light py-16 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-background-white shadow-xl rounded-2xl p-8 md:p-10">

        {/* Título */}
        <h2 className="text-3xl font-semibold text-primary-blue text-center mb-2">
          Contáctanos
        </h2>

        <p className="text-dark text-center mb-8">
          Envíanos tu consulta y te responderemos lo antes posible.
        </p>

        {submitted ? (
          <div className="text-center text-state-success font-medium text-lg">
            ✓ ¡Tu mensaje ha sido enviado correctamente!
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Nombre */}
            <div className="flex flex-col">
              <label className="text-dark font-medium mb-1">Nombre</label>
              <input
                type="text"
                {...register("nombre", { required: "El nombre es obligatorio" })}
                placeholder="Tu nombre"
                className={`w-full p-3 rounded-lg border border-subtle bg-background-white text-dark 
                  focus:ring-2 focus:ring-primary-blue focus:outline-none`}
              />
              {errors.nombre && (
                <p className="text-primary-red text-sm">{errors.nombre.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-dark font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Email inválido",
                  },
                })}
                placeholder="tucorreo@ejemplo.com"
                className={`w-full p-3 rounded-lg border border-subtle bg-background-white text-dark
                  focus:ring-2 focus:ring-primary-blue focus:outline-none`}
              />
              {errors.email && (
                <p className="text-primary-red text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="text-dark font-medium mb-1">Teléfono (opcional)</label>
              <input
                type="text"
                {...register("telefono", {
                  pattern: {
                    value: /^\+?[0-9\s\-]{7,15}$/,
                    message: "Teléfono inválido",
                  },
                })}
                placeholder="+54 9 381 000 0000"
                className={`w-full p-3 rounded-lg border border-subtle bg-background-white text-dark
                  focus:ring-2 focus:ring-primary-blue focus:outline-none`}
              />
              {errors.telefono && (
                <p className="text-primary-red text-sm">{errors.telefono.message}</p>
              )}
            </div>

            {/* Asunto */}
            <div>
              <label className="text-dark font-medium mb-1">Asunto</label>
              <input
                type="text"
                {...register("asunto")}
                placeholder="Motivo de contacto"
                className="w-full p-3 rounded-lg border border-subtle bg-background-white text-dark
                focus:ring-2 focus:ring-primary-blue focus:outline-none"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="text-dark font-medium mb-1">Mensaje</label>
              <textarea
                rows="4"
                {...register("mensaje", { required: "El mensaje es obligatorio" })}
                placeholder="Escribe tu mensaje..."
                className={`w-full p-3 rounded-lg border border-subtle bg-background-white text-dark resize-none
                focus:ring-2 focus:ring-primary-blue focus:outline-none`}
              />
              {errors.mensaje && (
                <p className="text-primary-red text-sm">{errors.mensaje.message}</p>
              )}
            </div>

            {errorMsg && (
              <p className="text-primary-red text-sm">{errorMsg}</p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 mt-2 rounded-lg font-semibold text-white shadow-md transition-all
                ${
                  isSubmitting
                    ? "bg-primary-blue/50 cursor-not-allowed"
                    : "bg-primary-blue hover:bg-primary-blue/80"
                }`}
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
