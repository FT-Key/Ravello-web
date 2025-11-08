import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, X, Phone, Mail, Globe, ChevronDown
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Navbar = ({ position = "sticky" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Destinos", submenu: ["Europa", "América", "Asia", "África", "Oceanía", "Caribe"] },
    { label: "Paquetes", link: "/paquetes" },
    { label: "Experiencias", submenu: ["Cruceros", "Circuitos", "City Tours", "Escapadas"] },
    { label: "Ofertas", link: "/ofertas" },
    { label: "Nosotros", link: "/sobre-nosotros" },
    { label: "Contacto", link: "/contacto" },
    { label: "Opiniones", link: "/opiniones" },
  ];

  // Fondo según posición y scroll
  const getNavbarBackground = () => {
    if (isScrolled) return "bg-white shadow-lg";
    if (position === "fixed") return "bg-transparent";
    return "bg-black/90 backdrop-blur-md border-b border-black/60";
  };

  return (
    <nav
      className={`${position} top-0 left-0 right-0 z-50 min-h-[115px] transition-all duration-500`}
    >
      <div
        className={`transition-all duration-500  ${getNavbarBackground()} ${!isScrolled && position !== "fixed" ? "bg-[url('./navbar/nav-bg.jpg')] bg-cover bg-bottom" : ""}`}
      >
        {/* --- Barra superior (solo visible cuando no hay scroll) --- */}
        <div
          className={`transition-all duration-500 overflow-hidden ${isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between text-sm py-2 border-b border-white border-opacity-20">
              <div className="flex items-center gap-6 text-white">
                <a
                  href="tel:+5491123456789"
                  className="flex items-center gap-2 hover:text-secondary-cyan transition-colors"
                >
                  <Phone size={14} />
                  <span>+54 911 2345-6789</span>
                </a>
                <a
                  href="mailto:info@ravello.com"
                  className="flex items-center gap-2 hover:text-secondary-cyan transition-colors"
                >
                  <Mail size={14} />
                  <span>info@ravello.com</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-white hover:text-secondary-cyan transition-colors flex items-center gap-1">
                  <Globe size={14} />
                  <span>ES</span>
                </button>
                <div className="flex gap-3">
                  <a href="#" className="text-white hover:text-secondary-cyan transition-colors" aria-label="Facebook">
                    <FaFacebook size={16} />
                  </a>
                  <a href="#" className="text-white hover:text-secondary-cyan transition-colors" aria-label="Instagram">
                    <FaInstagram size={16} />
                  </a>
                  <a href="#" className="text-white hover:text-secondary-cyan transition-colors" aria-label="Twitter">
                    <FaTwitter size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Barra principal --- */}
        <div
          className={`max-w-7xl mx-auto px-4 ${isScrolled ? "py-2" : "py-4"
            } transition-all duration-500`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <img
                  src="/ravello-mini-logo.svg"
                  alt="Ravello Logo"
                  className="w-[50px] h-[50px] object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold transition-colors ${isScrolled ? "text-primary-blue" : "text-white"
                    }`}
                >
                  Ra<span className={`transition-colors ${isScrolled ? "text-primary-red" : "text-white"}`}>v</span>ello
                </h1>
                <p
                  className={`text-xs transition-colors max-w-[120px] whitespace-normal break-words text-center sm:text-left ${isScrolled ? "text-light" : "text-white text-opacity-90"
                    }`}
                >
                  Administramos buenos momentos
                </p>
              </div>
            </Link>

            {/* Menú Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.submenu ? (
                    <>
                      <button
                        className={`px-4 py-2 font-medium transition-all rounded-lg flex items-center gap-1 ${isScrolled
                          ? "text-dark hover:text-black hover:bg-background-light"
                          : "text-white hover:text-black hover:bg-white hover:bg-opacity-10"
                          }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className="transition-transform group-hover:rotate-180"
                        />
                      </button>
                      <div
                        className={`absolute top-full left-0 w-56 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${activeDropdown === idx
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                          }`}
                      >
                        {item.submenu.map((subitem, subidx) => (
                          <a
                            key={subidx}
                            href="#"
                            className="block px-6 py-3 text-dark hover:bg-background-light hover:text-black transition-colors border-b border-border-subtle last:border-b-0"
                          >
                            {subitem}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.link}
                      className={`px-4 py-2 font-medium transition-all rounded-lg ${isScrolled
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

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/contacto"
                className="px-6 py-2 rounded-full border-2 border-[var(--color-primary-red)] text-[var(--color-primary-red)] font-semibold hover:bg-[var(--color-primary-red)] hover:text-white transition-all duration-300"
              >
                Cotizar viaje
              </Link>

            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled
                ? "text-dark hover:bg-background-light"
                : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`lg:hidden bg-white shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-6 space-y-2">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <>
                  <button className="w-full text-left px-4 py-3 text-dark font-medium rounded-lg">
                    {item.label}
                  </button>
                  <div className="pl-4 mt-1 space-y-1">
                    {item.submenu.map((subitem, subidx) => (
                      <a
                        key={subidx}
                        href="#"
                        className="block px-4 py-2 text-sm text-light hover:text-primary-blue transition-colors"
                      >
                        {subitem}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.link}
                  className="block px-4 py-3 text-dark hover:bg-background-light hover:text-primary-blue rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link
            to="/contacto"
            className="w-full mt-4 px-6 py-3 rounded-full bg-primary-red text-white font-semibold hover:bg-opacity-90 transition-all"
          >
            Cotizar viaje
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
