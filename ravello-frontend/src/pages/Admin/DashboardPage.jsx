// src/pages/Admin/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";
import toast from "react-hot-toast";
import {
  Package,
  Calendar,
  Star,
  MessageSquare,
  Users,
  Mail,
  Tag,
  TrendingUp,
  Activity
} from "lucide-react";

export default function DashboardPage() {
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

  const cards = [
    {
      title: "Paquetes",
      value: stats.packages,
      icon: Package,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      path: "/admin/paquetes"
    },
    {
      title: "Fechas de Paquetes",
      value: stats.packageDates,
      icon: Calendar,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      path: "/admin/paquetes-fechas"
    },
    {
      title: "Usuarios",
      value: stats.users,
      icon: Users,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      path: "/admin/usuarios"
    },
    {
      title: "Reseñas",
      value: stats.reviews,
      icon: Star,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      path: "/admin/resenias"
    },
    {
      title: "Contactos",
      value: stats.contacts,
      icon: MessageSquare,
      color: "bg-pink-500",
      lightColor: "bg-pink-50",
      textColor: "text-pink-600",
      path: "/admin/contactos"
    },
    {
      title: "Newsletter",
      value: stats.newsletter,
      icon: Mail,
      color: "bg-cyan-500",
      lightColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      path: "/admin/boletin"
    },
    {
      title: "Ofertas Imperdibles",
      value: stats.offers,
      icon: Tag,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      path: "/admin/ofertas-imperdibles"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-500 text-sm">
              Resumen general del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.lightColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <div className={`${card.color} text-white px-2 py-1 rounded text-xs font-semibold`}>
                  {card.value}
                </div>
              </div>
              
              <h3 className="text-gray-700 font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">
                Ver todos
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Acciones Rápidas</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/paquetes")}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
          >
            Crear Paquete
          </button>
          <button
            onClick={() => navigate("/admin/paquetes-fechas")}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
          >
            Agregar Fecha
          </button>
          <button
            onClick={() => navigate("/admin/resenias")}
            className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm"
          >
            Moderar Reseñas
          </button>
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm"
          >
            Gestionar Usuarios
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-gray-500 text-sm">
        <p>Última actualización: {new Date().toLocaleString("es-AR")}</p>
      </div>
    </div>
  );
}