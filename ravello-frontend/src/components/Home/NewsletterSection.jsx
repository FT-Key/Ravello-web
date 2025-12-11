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
    <section className="newsletter-section bg-sand-fade no-select">
      <div className="newsletter-container">
        <div className="newsletter-content" data-aos="zoom-in">
          
          {/* TÍTULO */}
          <h2 className="newsletter-title no-select">
            Recibí nuestras mejores ofertas
          </h2>

          {/* SUBTÍTULO */}
          <p className="newsletter-subtitle no-select">
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
              className={`newsletter-button ${status === "loading" ? "loading" : ""}`}
            >
              <span className="no-select">
                {status === "loading" ? "Enviando..." : "Suscribirse"}
              </span>
            </button>
          </form>

          {/* MENSAJES */}
          {status === "success" && (
            <p className="newsletter-message success no-select">
              ✅ ¡Te suscribiste correctamente!
            </p>
          )}

          {status === "error" && (
            <p className="newsletter-message error no-select">
              ❌ Ocurrió un error. Verificá tu email.
            </p>
          )}

          {/* FOOTNOTE */}
          <p className="newsletter-footnote no-select">
            No spam. Solo las mejores ofertas para tu próximo viaje.
          </p>
        </div>
      </div>
    </section>
  );
}
