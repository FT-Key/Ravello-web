import React, { useState } from "react";
import clientAxios from "../../api/axiosConfig";
import "./NewsletterSection.css";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // success | error | loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await clientAxios.post("/newsletter", { email });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="newsletter-section bg-sand-fade">
      <div className="newsletter-container">
        <div className="newsletter-content" data-aos="zoom-in">
          <h2 className="newsletter-title">Recibí nuestras mejores ofertas</h2>
          <p className="newsletter-subtitle">
            Suscribite y no te pierdas ninguna promoción exclusiva
          </p>

          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmit}
            className="newsletter-form"
            data-aos="flip-up"
            data-aos-delay="200"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              className="newsletter-input"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={`newsletter-button ${
                status === "loading" ? "loading" : ""
              }`}
            >
              {status === "loading" ? "Enviando..." : "Suscribirse"}
            </button>
          </form>

          {/* MENSAJES */}
          {status === "success" && (
            <p className="newsletter-message success">
              ✅ ¡Te suscribiste correctamente!
            </p>
          )}
          {status === "error" && (
            <p className="newsletter-message error">
              ❌ Ocurrió un error. Verificá tu email.
            </p>
          )}

          <p className="newsletter-footnote">
            No spam. Solo las mejores ofertas para tu próximo viaje.
          </p>
        </div>
      </div>
    </section>
  );
}
