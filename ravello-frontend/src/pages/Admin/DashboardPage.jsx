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
          clientAxios.get("/newsletter"),
        ]);

        // ---- LOG detallado ----
        console.groupCollapsed("📊 [fetchStats] Respuestas del backend");
        console.group("👤 /users");
        console.log("status:", usersRes.status);
        console.log("data:", usersRes.data);
        console.log("headers:", usersRes.headers);
        console.groupEnd();

        console.group("📦 /packages");
        console.log("status:", packagesRes.status);
        console.log("data:", packagesRes.data);
        console.log("headers:", packagesRes.headers);
        console.groupEnd();

        console.group("⭐ /reviews");
        console.log("status:", reviewsRes.status);
        console.log("data:", reviewsRes.data);
        console.log("headers:", reviewsRes.headers);
        console.groupEnd();

        console.group("✉️ /contacts");
        console.log("status:", contactsRes.status);
        console.log("data:", contactsRes.data);
        console.log("headers:", contactsRes.headers);
        console.groupEnd();

        console.group("🔥 /featured-promotions");
        console.log("status:", offersRes.status);
        console.log("data:", offersRes.data);
        console.log("headers:", offersRes.headers);
        console.groupEnd();

        console.group("📬 /newsletter");
        console.log("status:", newsletterRes.status);
        console.log("data:", newsletterRes.data);
        console.log("headers:", newsletterRes.headers);
        console.groupEnd();

        console.groupEnd(); // end main group
        // -----------------------

        // Función segura para extraer "total" de distintas formas de respuesta
        const extractTotal = (response) => {
          // Si no hay respuesta o no es un objeto, no hay datos válidos
          if (!response || typeof response !== "object") return 0;

          const payload = response.data;

          // Si la respuesta es un array plano → el total es el largo del array
          if (Array.isArray(payload)) {
            return payload.length;
          }

          // Si no hay data → 0
          if (!payload) return 0;

          // Caso estándar con paginación → { pagination: { total } }
          const hasPagination =
            payload.pagination &&
            typeof payload.pagination.total === "number";

          if (hasPagination) {
            return payload.pagination.total;
          }

          // Si la API devuelve { items: [...] }
          if (Array.isArray(payload.items)) {
            return payload.items.length;
          }

          // Compatibilidad con estructuras antiguas: { packages: [...] }, { users: [...] }, etc.
          const possibleArrayKeys = ["items", "packages", "users", "data", "results"];

          for (const key of possibleArrayKeys) {
            if (Array.isArray(payload[key])) {
              return payload[key].length;
            }
          }

          // Si viene un número directo: { total: X }
          if (typeof payload.total === "number") {
            return payload.total;
          }

          // No se encontró nada → 0
          return 0;
        };

        const totalUsers = extractTotal(usersRes);
        const totalPackages = extractTotal(packagesRes);
        const totalReviews = extractTotal(reviewsRes);
        const totalContacts = extractTotal(contactsRes);
        // ofertas: puede venir paginado o con packages dentro
        const totalOffers =
          (offersRes?.data?.pagination?.total) ||
          (Array.isArray(offersRes?.data?.items) && offersRes.data.items.length) ||
          (Array.isArray(offersRes?.data?.packages) && offersRes.data.packages.length) ||
          0;
        const totalNewsletter = extractTotal(newsletterRes);

        console.log("➡️ Totales calculados:", {
          totalUsers,
          totalPackages,
          totalReviews,
          totalContacts,
          totalOffers,
          totalNewsletter,
        });

        setStats({
          users: totalUsers,
          packages: totalPackages,
          reviews: totalReviews,
          contacts: totalContacts,
          offers: totalOffers,
          newsletter: totalNewsletter,
        });
      } catch (err) {
        // Log completo del error
        console.error("❌ Error cargando estadísticas:", err);
        if (err.response) {
          console.error("➡️ err.response.data:", err.response.data);
          console.error("➡️ err.response.status:", err.response.status);
          console.error("➡️ err.response.headers:", err.response.headers);
        } else {
          console.error("➡️ error (no response):", err.message || err);
        }
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
