import React, { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useUserStore(); // por si luego se usan permisos
  const [stats, setStats] = useState({
    users: 0,
    packages: 0,
    reviews: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, packagesRes, reviewsRes, contactsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/packages"),
          fetch("/api/reviews"),
          fetch("/api/contacts")
        ]);

        const [usersData, packagesData, reviewsData, contactsData] = await Promise.all([
          usersRes.json(),
          packagesRes.json(),
          reviewsRes.json(),
          contactsRes.json()
        ]);

        setStats({
          users: usersData.length,
          packages: packagesData.length,
          reviews: reviewsData.length,
          contacts: contactsData.length
        });

      } catch (err) {
        console.error("Error cargando estadísticas:", err);
        toast.error("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Cargando estadísticas del dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Usuarios */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Usuarios</span>
          <span className="text-2xl font-bold">{stats.users}</span>
          <button
            onClick={() => window.location.href = "/admin/usuarios"}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Administrar
          </button>
        </div>

        {/* Paquetes */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Paquetes</span>
          <span className="text-2xl font-bold">{stats.packages}</span>
          <button
            onClick={() => window.location.href = "/admin/paquetes"}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Administrar
          </button>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Reseñas</span>
          <span className="text-2xl font-bold">{stats.reviews}</span>
          <button
            onClick={() => window.location.href = "/admin/resenias"}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Administrar
          </button>
        </div>

        {/* Contactos */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-gray-500">Mensajes de contacto</span>
          <span className="text-2xl font-bold">{stats.contacts}</span>
          <button
            onClick={() => window.location.href = "/admin/contactos"}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Administrar
          </button>
        </div>
      </div>

      {/* Aquí podrías agregar gráficos o más estadísticas si querés */}
      <div className="mt-6 text-gray-500 text-sm">
        Última actualización: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
