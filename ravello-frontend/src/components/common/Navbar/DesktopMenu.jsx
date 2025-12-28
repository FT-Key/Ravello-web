// src/components/common/Navbar/DesktopMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function DesktopMenu({
  menuItems,
  isScrolled,
  activeDropdown,
  setActiveDropdown,
  handleMobileLinkClick,
}) {
  return (
    <div className="hidden lg:flex items-center gap-1">
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="relative group no-select"
          onMouseEnter={() => setActiveDropdown(idx)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {item.submenu ? (
            <>
              <button
                className={`px-4 py-2 font-medium transition-all rounded-lg flex items-center gap-1 no-select ${
                  isScrolled
                    ? "text-dark hover:text-black hover:bg-background-light"
                    : "text-white hover:text-black hover:bg-white hover:bg-opacity-10"
                }`}
              >
                {item.label}
                <ChevronDown
                  size={16}
                  className="transition-transform group-hover:rotate-180 no-select"
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 w-56 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                  activeDropdown === idx
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="max-h-60 overflow-y-auto">
                  {item.submenu.length === 0 ? (
                    <p className="px-6 py-3 text-sm text-gray-500 no-select">
                      Cargando...
                    </p>
                  ) : (
                    item.submenu.map((subitem, subidx) => {
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
                          className="block px-6 py-3 text-dark hover:bg-background-light hover:text-black transition-colors border-b border-border-subtle last:border-b-0 no-select"
                        >
                          {nombreCompleto}
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <Link
              onClick={handleMobileLinkClick}
              to={item.link}
              className={`px-4 py-2 font-medium transition-all rounded-lg no-select ${
                isScrolled
                  ? "text-dark hover:text-black hover:bg-background-light"
                  : "text-white hover:text-black hover:bg-white hover:bg-opacity-10"
              }`}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}