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
      const res = await clientAxios.post("/contacts", {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        mensaje: data.mensaje,
        asunto: data.asunto || "General",
      });

      console.log("📤 Mensaje enviado:", res.data);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      setErrorMsg(
        error.response?.data?.error || "Ocurrió un error al enviar el mensaje."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold mb-4 text-center">📬 Contáctanos</h2>
        <p className="text-slate-300 mb-6 text-center">
          Envíanos tu consulta y te responderemos lo antes posible.
        </p>

        {submitted ? (
          <div className="text-center text-green-400 font-medium">
            ✅ ¡Tu mensaje ha sido enviado correctamente!
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                type="text"
                {...register("nombre", { required: "El nombre es obligatorio" })}
                placeholder="Tu nombre"
                className={`w-full p-3 rounded-lg bg-slate-900/60 border ${
                  errors.nombre ? "border-red-500" : "border-slate-700"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              {errors.nombre && (
                <p className="text-red-400 text-sm">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Correo electrónico</label>
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
                className={`w-full p-3 rounded-lg bg-slate-900/60 border ${
                  errors.email ? "border-red-500" : "border-slate-700"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Teléfono (opcional)</label>
              <input
                type="text"
                {...register("telefono", {
                  pattern: {
                    value: /^\+?[0-9\s\-]{7,15}$/,
                    message: "Teléfono inválido",
                  },
                })}
                placeholder="+54 9 381 000 0000"
                className={`w-full p-3 rounded-lg bg-slate-900/60 border ${
                  errors.telefono ? "border-red-500" : "border-slate-700"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              {errors.telefono && (
                <p className="text-red-400 text-sm">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Asunto</label>
              <input
                type="text"
                {...register("asunto")}
                placeholder="Motivo de contacto"
                className="w-full p-3 rounded-lg bg-slate-900/60 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Mensaje</label>
              <textarea
                rows="4"
                {...register("mensaje", { required: "El mensaje es obligatorio" })}
                placeholder="Escribe tu mensaje..."
                className={`w-full p-3 rounded-lg bg-slate-900/60 border ${
                  errors.mensaje ? "border-red-500" : "border-slate-700"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none`}
              />
              {errors.mensaje && (
                <p className="text-red-400 text-sm">{errors.mensaje.message}</p>
              )}
            </div>

            {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 mt-2 rounded-lg font-semibold shadow-lg transition-all ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
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
