// src/components/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Calendar,
  Star,
  MessageSquare,
  Users,
  Mail,
  Tag,
  ChevronLeft,
  LogOut,
  User,
  Home
} from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();

  // Cerrar sidebar en móvil por defecto
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
      color: "text-blue-600"
    },
    {
      icon: Package,
      label: "Paquetes",
      path: "/admin/paquetes",
      color: "text-purple-600"
    },
    {
      icon: Calendar,
      label: "Fechas de Paquetes",
      path: "/admin/paquetes-fechas",
      color: "text-green-600"
    },
    {
      icon: Tag,
      label: "Ofertas Imperdibles",
      path: "/admin/ofertas-imperdibles",
      color: "text-orange-600"
    },
    {
      icon: Star,
      label: "Reseñas",
      path: "/admin/resenias",
      color: "text-yellow-600"
    },
    {
      icon: MessageSquare,
      label: "Contactos",
      path: "/admin/contactos",
      color: "text-pink-600"
    },
    {
      icon: Users,
      label: "Usuarios",
      path: "/admin/usuarios",
      color: "text-indigo-600"
    },
    {
      icon: Mail,
      label: "Newsletter",
      path: "/admin/boletin",
      color: "text-cyan-600"
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay para móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header del sidebar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                !sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${!sidebarOpen && "justify-center"}
                `}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active ? "text-blue-600" : item.color
                  }`}
                />
                {sidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Usuario y logout */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* Botón volver al inicio en móvil/sidebar */}
          <button
            onClick={() => navigate("/")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-gray-700 hover:bg-gray-100 transition-colors
              ${!sidebarOpen && "justify-center"}
            `}
            title={!sidebarOpen ? "Volver al inicio" : ""}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="font-medium text-sm">Volver al sitio</span>
            )}
          </button>

          <button
            onClick={() => navigate("/mi-perfil")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-gray-700 hover:bg-gray-100 transition-colors
              ${!sidebarOpen && "justify-center"}
            `}
            title={!sidebarOpen ? "Mi Perfil" : ""}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user?.nombre}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-red-600 hover:bg-red-50 transition-colors
              ${!sidebarOpen && "justify-center"}
            `}
            title={!sidebarOpen ? "Cerrar Sesión" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find((item) => isActive(item.path))?.label ||
                "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="Volver al inicio"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Ir al sitio</span>
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-700">
                {user?.nombre}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.nombre?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}