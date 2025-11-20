import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error" | "manual"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      handleUnsubscribe(emailParam);
    } else {
      setStatus("manual");
    }
  }, []);

  const handleUnsubscribe = async (emailToUnsub) => {
    try {
      const res = await clientAxios.post("/newsletter/unsubscribe", { email: emailToUnsub });

      setStatus("success");
      setMessage(res.data.message || "Tu suscripción fue cancelada correctamente ✅");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(
        err.response?.data?.error || "Error al conectar con el servidor ❌"
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    handleUnsubscribe(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Cancelar suscripción
        </h1>

        {status === "loading" && (
          <p className="text-gray-600">Procesando tu solicitud...</p>
        )}

        {status === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600">
              Ingresá tu email para cancelar tu suscripción a nuestra
              newsletter.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition"
            >
              Cancelar suscripción
            </button>
          </form>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <p className="text-green-600 font-medium">{message}</p>
            <p className="text-sm text-gray-500">
              Lamentamos verte partir 😔.
              <br />
              Podés volver a suscribirte en cualquier momento desde nuestra web.
            </p>
            <a
              href="/"
              className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Volver al inicio
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <p className="text-red-600 font-medium">{message}</p>
            <button
              onClick={() => setStatus("manual")}
              className="text-blue-600 underline hover:text-blue-700"
            >
              Intentar nuevamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
