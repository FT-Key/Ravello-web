// src/components/common/Navbar/MobileMenu.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogIn, UserPlus, User, LogOut, Calendar, Settings } from "lucide-react";
import { useUserStore } from "../../../stores/useUserStore";

export default function MobileMenu({
  isMobileMenuOpen,
  menuItems,
  mobileDropdowns,
  toggleMobileDropdown,
  handleMobileLinkClick,
  user,
  loadingUser,
}) {
  const navigate = useNavigate();
  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    handleMobileLinkClick();
    navigate("/");
  };

  return (
    <div
      className={`lg:hidden bg-white shadow-xl overflow-y-auto transition-all duration-300 ${
        isMobileMenuOpen
          ? "max-h-[80vh] opacity-100 pointer-events-auto"
          : "max-h-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="px-4 py-6 space-y-2 no-select">
        {menuItems.map((item, idx) => (
          <div key={idx} className="no-select">
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleMobileDropdown(idx)}
                  className="w-full flex justify-between items-center px-4 py-3 text-dark font-medium rounded-lg no-select"
                >
                  {item.label}
                  <ChevronDown
                    size={18}
                    className={`transition-transform no-select ${
                      mobileDropdowns[idx] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`pl-4 mt-1 space-y-1 transition-all overflow-hidden ${
                    mobileDropdowns[idx] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {item.submenu.map((subitem, subidx) => {
                    const nombreCompleto = `${subitem.ciudad}${
                      subitem.pais ? ", " + subitem.pais : ""
                    }`;
                    const ciudadSola = subitem.ciudad;

                    return (
                      <Link
                        onClick={handleMobileLinkClick}
                        key={subidx}
                        to={`/paquetes?destino=${encodeURIComponent(
                          ciudadSola
                        )}`}
                        className="block px-4 py-2 text-sm text-light hover:text-primary-blue transition-colors no-select"
                      >
                        {nombreCompleto}
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <Link
                onClick={handleMobileLinkClick}
                to={item.link}
                className="block px-4 py-3 text-dark hover:bg-background-light hover:text-primary-blue rounded-lg transition-colors font-medium no-select"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}

        <Link
          onClick={handleMobileLinkClick}
          to="/contacto"
          className="w-full mt-4 px-6 py-3 rounded-full bg-primary-red text-white font-semibold hover:bg-opacity-90 transition-all no-select block text-center"
        >
          Cotizar viaje
        </Link>

        {/* SECCIÓN DE AUTH EN MOBILE */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          {loadingUser ? (
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          ) : user ? (
            <>
              {/* Info Usuario */}
              <div className="px-4 py-3 bg-background-light rounded-lg mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-primary-red)] rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <User size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs text-light">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Opciones de usuario */}
              <Link
                onClick={handleMobileLinkClick}
                to="/me/perfil"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark hover:bg-background-light font-medium"
              >
                <User size={20} />
                <span>Mi Perfil</span>
              </Link>

              <Link
                onClick={handleMobileLinkClick}
                to="/mis-reservas"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark hover:bg-background-light font-medium"
              >
                <Calendar size={20} />
                <span>Mis Reservas</span>
              </Link>

              <Link
                onClick={handleMobileLinkClick}
                to="/me/configuracion"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark hover:bg-background-light font-medium"
              >
                <Settings size={20} />
                <span>Configuración</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium w-full mt-2"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link
                onClick={handleMobileLinkClick}
                to="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-dark hover:bg-background-light border border-gray-300 mb-3"
              >
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
              </Link>

              <Link
                onClick={handleMobileLinkClick}
                to="/register"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium text-white bg-primary-red hover:bg-opacity-90"
              >
                <UserPlus size={20} />
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}