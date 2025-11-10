import React, { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import toast from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";

export default function DashboardPage() {
  const { user } = useUserStore();
  const [stats, setStats] = useState({
    users: 0,
    packages: 0,
    reviews: 0,
    contacts: 0,
    offers: 0,
    newsletter: 0, // 👈 agregado
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          usersRes,
          packagesRes,
          reviewsRes,
          contactsRes,
          offersRes,
          newsletterRes,
        ] = await Promise.all([
          clientAxios.get("/users"),
          clientAxios.get("/packages"),
          clientAxios.get("/reviews"),
          clientAxios.get("/contacts"),
          clientAxios.get("/featured-promotions"),
          clientAxios.get("/newsletter"), // 👈 obtiene lista de suscriptores
        ]);

        setStats({
          users: usersRes.data.length,
          packages: packagesRes.data.length,
          reviews: reviewsRes.data.length,
          contacts: contactsRes.data.length,
          offers: offersRes.data?.packages?.length,
          newsletter: newsletterRes.data.length, // 👈 total suscriptores
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Usuarios */}
        <DashboardCard
          label="Usuarios"
          value={stats.users}
          onClick={() => (window.location.href = "/admin/usuarios")}
        />

        {/* Paquetes */}
        <DashboardCard
          label="Paquetes"
          value={stats.packages}
          onClick={() => (window.location.href = "/admin/paquetes")}
        />

        {/* Ofertas imperdibles */}
        <DashboardCard
          label="Ofertas imperdibles"
          value={stats.offers}
          onClick={() => (window.location.href = "/admin/ofertas-imperdibles")}
        />

        {/* Reseñas */}
        <DashboardCard
          label="Reseñas"
          value={stats.reviews}
          onClick={() => (window.location.href = "/admin/resenias")}
        />

        {/* Contactos */}
        <DashboardCard
          label="Mensajes de contacto"
          value={stats.contacts}
          onClick={() => (window.location.href = "/admin/contactos")}
        />

        {/* Newsletter */}
        <DashboardCard
          label="Suscriptores Newsletter"
          value={stats.newsletter}
          onClick={() => (window.location.href = "/admin/boletin")}
        />
      </div>

      <div className="mt-6 text-gray-500 text-sm">
        Última actualización: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

// 🔹 Componente auxiliar reutilizable para evitar repetición
function DashboardCard({ label, value, onClick }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <span className="text-gray-500">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      <button
        onClick={onClick}
        className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Administrar
      </button>
    </div>
  );
}
