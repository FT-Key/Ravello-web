import React, { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import toast from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    packages: 0,
    reviews: 0,
    contacts: 0,
    offers: 0,
    newsletter: 0,
    packageDates: 0,
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
          packageDatesRes,
        ] = await Promise.all([
          clientAxios.get("/users"),
          clientAxios.get("/packages"),
          clientAxios.get("/reviews"),
          clientAxios.get("/contacts"),
          clientAxios.get("/featured-promotions"),
          clientAxios.get("/newsletter"),
          clientAxios.get("/package-dates"),
        ]);

        const extractTotal = (response) => {
          if (!response || typeof response !== "object") return 0;

          const payload = response.data;
          if (!payload) return 0;

          if (typeof payload.total === "number") return payload.total;

          if (Array.isArray(payload.items)) return payload.items.length;

          if (Array.isArray(payload)) return payload.length;

          const keys = ["packages", "users", "data", "results"];
          for (const k of keys) {
            if (Array.isArray(payload[k])) return payload[k].length;
          }

          return 0;
        };

        setStats({
          users: extractTotal(usersRes),
          packages: extractTotal(packagesRes),
          reviews: extractTotal(reviewsRes),
          contacts: extractTotal(contactsRes),
          offers:
            offersRes?.data?.pagination?.total ||
            offersRes?.data?.items?.length ||
            offersRes?.data?.packages?.length ||
            0,
          newsletter: extractTotal(newsletterRes),
          packageDates: extractTotal(packageDatesRes),
        });
      } catch (err) {
        console.error("❌ Error cargando estadísticas:", err);
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
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
        Dashboard de Administración
      </h1>

      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        xl:grid-cols-7
        gap-6
      "
      >
        <DashboardCard
          label="Usuarios"
          value={stats.users}
          onClick={() => navigate("/admin/usuarios")}
        />

        <DashboardCard
          label="Paquetes"
          value={stats.packages}
          onClick={() => navigate("/admin/paquetes")}
        />

        <DashboardCard
          label="Fechas de Paquetes"
          value={stats.packageDates}
          onClick={() => navigate("/admin/paquetes-fechas")}
        />

        <DashboardCard
          label="Ofertas imperdibles"
          value={stats.offers}
          onClick={() => navigate("/admin/ofertas-imperdibles")}
        />

        <DashboardCard
          label="Reseñas"
          value={stats.reviews}
          onClick={() => navigate("/admin/resenias")}
        />

        <DashboardCard
          label="Mensajes de contacto"
          value={stats.contacts}
          onClick={() => navigate("/admin/contactos")}
        />

        <DashboardCard
          label="Newsletter"
          value={stats.newsletter}
          onClick={() => navigate("/admin/boletin")}
        />
      </div>

      <div className="mt-8 text-gray-500 text-sm text-center sm:text-left">
        Última actualización: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

function DashboardCard({ label, value, onClick }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <span className="text-gray-500 text-center">{label}</span>
      <div className="flex-1" />
      <span className="text-2xl font-bold text-center mb-2">{value}</span>
      <button
        onClick={onClick}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Administrar
      </button>
    </div>
  );
}
