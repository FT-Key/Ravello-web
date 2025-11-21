import React, { useState } from "react";
import clientAxios from "../../api/axiosConfig";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // success | error | loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await clientAxios.post("/newsletter", { email });
      console.log("✅ Suscripción exitosa:", res.data);
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("❌ Error al suscribirse:", err.response?.data || err);
      setStatus("error");
    }
  };

  return (
    <section className="py-20 bg-sand-fade">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            Recibí nuestras mejores ofertas
          </h2>
          <p className="text-lg mb-8 text-light">
            Suscribite y no te pierdas ninguna promoción exclusiva
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-full shadow-xl p-2 flex items-center max-w-2xl mx-auto"
            data-aos="flip-up"
            data-aos-delay="200"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              className="flex-1 px-6 py-3 outline-none rounded-l-full text-dark"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={`bg-primary-red rounded-full px-8 py-3 font-semibold text-white border-0 transition-transform hover:scale-105 ${status === "loading" ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {status === "loading" ? "Enviando..." : "Suscribirse"}
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-600 mt-4">
              ✅ ¡Te suscribiste correctamente!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-4">
              ❌ Ocurrió un error. Verificá tu email.
            </p>
          )}
          <p className="text-sm mt-4 text-light">
            No spam. Solo las mejores ofertas para tu próximo viaje.
          </p>
        </div>
      </div>
    </section>
  );
}
