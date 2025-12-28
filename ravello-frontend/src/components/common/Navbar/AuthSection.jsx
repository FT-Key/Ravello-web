// src/components/common/Navbar/AuthSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, User, LogOut, Calendar, Settings } from "lucide-react";
import { useUserStore } from "../../../stores/useUserStore";

export default function AuthSection({ user, loadingUser, isScrolled }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useUserStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  if (loadingUser) {
    return (
      <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all no-select ${
            isScrolled
              ? "text-dark hover:bg-background-light"
              : "text-white hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <LogIn size={18} />
          <span>Iniciar Sesión</span>
        </Link>

        <Link
          to="/register"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-red)] text-white font-semibold hover:bg-opacity-90 transition-all no-select"
        >
          <UserPlus size={18} />
          <span>Registrarse</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all no-select ${
          isScrolled
            ? "text-dark hover:bg-background-light"
            : "text-white hover:bg-white hover:text-black hover:bg-opacity-10"
        }`}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-primary-red)] rounded-full flex items-center justify-center text-white font-semibold">
          {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <User size={16} />}
        </div>
        <span>{user?.nombre || "Usuario"}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-dark">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-light mt-1">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              to="/me/perfil"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-background-light transition-colors text-dark"
            >
              <User size={18} />
              <span className="text-sm">Mi Perfil</span>
            </Link>

            <Link
              to="/mis-reservas"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-background-light transition-colors text-dark"
            >
              <Calendar size={18} />
              <span className="text-sm">Mis Reservas</span>
            </Link>

            <Link
              to="/me/configuracion"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-background-light transition-colors text-dark"
            >
              <Settings size={18} />
              <span className="text-sm">Configuración</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 w-full"
            >
              <LogOut size={18} />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}