import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";

export default function ManageNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await clientAxios.get("/newsletter");
      setSubscribers(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar los suscriptores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const toggleSubscription = async (id, currentStatus) => {
    try {
      await clientAxios.put(`/newsletter/${id}`, {
        active: !currentStatus,
      });
      setSubscribers((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, active: !currentStatus } : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado del suscriptor");
    }
  };

  const deleteSubscriber = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este correo?")) return;
    try {
      await clientAxios.delete(`/newsletter/${id}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el suscriptor");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        📬 Gestión de suscriptores
      </h1>

      {loading ? (
        <p className="text-gray-500">Cargando suscriptores...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-600">No hay suscriptores aún.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{sub.email}</td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        sub.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sub.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => toggleSubscription(sub._id, sub.active)}
                      className={`px-3 py-1 rounded text-white text-xs font-medium ${
                        sub.active
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {sub.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => deleteSubscriber(sub._id)}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
