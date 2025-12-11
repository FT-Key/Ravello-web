import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  Mail,
  Globe,
  ChevronDown,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import clientAxios from "../../api/axiosConfig";

// ✅ Importamos el siteConfig
import { siteConfig } from "../../config/siteConfig";

const Navbar = ({ position = "sticky" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});

  const [destinos, setDestinos] = useState([]);

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const res = await clientAxios.get("/packages/destinos/list");

        if (res.data.success && Array.isArray(res.data.data)) {
          setDestinos(res.data.data);
        } else {
          console.warn("Formato inesperado en destinos:", res.data);
          setDestinos([]);
        }
      } catch (err) {
        console.error("Error al cargar destinos:", err);
      }
    };

    fetchDestinos();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Destinos", submenu: destinos },
    { label: "Paquetes", link: "/paquetes" },
    { label: "Nosotros", link: "/sobre-nosotros" },
    { label: "Contacto", link: "/contacto" },
    { label: "Opiniones", link: "/opiniones" },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdowns({});
  };

  const toggleMobileDropdown = (index) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getNavbarBackground = () => {
  if (isScrolled)
    return "bg-white/20 backdrop-blur-xl border border-white/10 shadow-lg";

  if (position === "fixed")
    return "bg-transparent";

  return "bg-black/90 backdrop-blur-md border-b border-black/60";
};


  return (
    <nav className={`${position} top-0 left-0 right-0 z-50 min-h-[115px] transition-all duration-500`}>
      <div
        className={`
      transition-all duration-500
      ${getNavbarBackground()}
      ${!isScrolled && position !== "fixed" ? "bg-[url('/navbar/nav-bg.jpg')] bg-cover bg-bottom" : ""}
      ${isScrolled ? "w-full sm:w-[95%] mx-auto rounded-b-2xl shadow-xl backdrop-blur-md border border-black/10" : "w-full"}
    `}
      >


        {/* Barra superior */}
        <div
          className={`transition-all duration-500 overflow-hidden ${isScrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center text-sm py-2 border-b border-white border-opacity-20 min-h-[56px]">

              {/* IZQUIERDA — Teléfono + Email */}
              <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-6 text-white">

                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-2 hover:text-secondary-cyan transition-colors text-sm"
                >
                  <Phone size={16} />
                  <span className="leading-tight">{siteConfig.contact.phone}</span>
                </a>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 hover:text-secondary-cyan transition-colors text-sm"
                >
                  <Mail size={16} />
                  <span className="leading-tight">{siteConfig.contact.email}</span>
                </a>
              </div>

              {/* DERECHA — Idioma + Redes */}
              <div className="flex items-center gap-4 text-white ml-4">

                <button
                  aria-label="Cambiar idioma"
                  className="hover:text-secondary-cyan transition-colors flex items-center gap-1 text-sm"
                >
                  <Globe size={14} />
                  <span>ES</span>
                </button>

                <div className="flex items-center gap-3 whitespace-nowrap">
                  <a
                    href={siteConfig.social.facebook}
                    aria-label="Facebook"
                    className="hover:text-secondary-cyan transition-colors"
                  >
                    <FaFacebook size={20} />
                  </a>

                  <a
                    href={siteConfig.social.instagram}
                    aria-label="Instagram"
                    className="hover:text-secondary-cyan transition-colors"
                  >
                    <FaInstagram size={20} />
                  </a>

                  <a
                    href={siteConfig.social.twitter}
                    aria-label="Twitter"
                    className="hover:text-secondary-cyan transition-colors"
                  >
                    <FaTwitter size={20} />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Barra principal */}
        <div className={`max-w-7xl mx-auto px-4 ${isScrolled ? "py-2" : "py-4"} transition-all duration-500`}>
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link onClick={handleMobileLinkClick} to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <img src="/ravello-mini-logo.svg" alt="Ravello Logo" className="w-[50px] h-[50px] object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors ${isScrolled ? "text-primary-blue" : "text-white"}`}>
                  Ra<span className={`${isScrolled ? "text-primary-red" : "text-white"}`}>v</span>ello
                </h1>
                <p className={`text-xs transition-colors max-w-[120px] whitespace-normal break-words text-center sm:text-left ${isScrolled ? "text-light" : "text-white text-opacity-90"
                  }`}>
                  Administramos buenos momentos
                </p>
              </div>
            </Link>

            {/* MENÚ DESKTOP */}
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
                        <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                      </button>

                      {/* Dropdown */}
                      <div
                        className={`absolute top-full left-0 w-56 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${activeDropdown === idx
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                          }`}
                      >
                        <div className="max-h-60 overflow-y-auto">
                          {item.submenu.length === 0 ? (
                            <p className="px-6 py-3 text-sm text-gray-500">Cargando...</p>
                          ) : (
                            item.submenu.map((subitem, subidx) => {
                              // 🔹 Mostrar "Ciudad, País" pero enviar solo "Ciudad"
                              const nombreCompleto = `${subitem.ciudad}${subitem.pais ? ", " + subitem.pais : ""
                                }`;
                              const ciudadSola = subitem.ciudad;

                              return (
                                <Link
                                  onClick={handleMobileLinkClick}
                                  key={subidx}
                                  to={`/paquetes?destino=${encodeURIComponent(ciudadSola)}`}
                                  className="block px-6 py-3 text-dark hover:bg-background-light hover:text-black transition-colors border-b border-border-subtle last:border-b-0"
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

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                onClick={handleMobileLinkClick}
                to="/contacto"
                className="px-6 py-2 rounded-full border-2 border-[var(--color-primary-red)] text-[var(--color-primary-red)] font-semibold hover:bg-[var(--color-primary-red)] hover:text-white transition-all duration-300"
              >
                Cotizar viaje
              </Link>
            </div>

            {/* Botón Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled
                ? "text-dark hover:bg-background-light"
                : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      <div
        className={`lg:hidden bg-white shadow-xl overflow-y-auto transition-all duration-300 ${isMobileMenuOpen
          ? "max-h-[80vh] opacity-100 pointer-events-auto"
          : "max-h-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="px-4 py-6 space-y-2">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <>
                  {/* Botón que ABRE con CLICK */}
                  <button
                    onClick={() => toggleMobileDropdown(idx)}
                    className="w-full flex justify-between items-center px-4 py-3 text-dark font-medium rounded-lg"
                  >
                    {item.label}
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${mobileDropdowns[idx] ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Contenido del dropdown MOBILE */}
                  <div
                    className={`pl-4 mt-1 space-y-1 transition-all overflow-hidden ${mobileDropdowns[idx] ? "max-h-96" : "max-h-0"
                      }`}
                  >
                    {item.submenu.map((subitem, subidx) => {
                      const nombreCompleto = `${subitem.ciudad}${subitem.pais ? ", " + subitem.pais : ""
                        }`;
                      const ciudadSola = subitem.ciudad;

                      return (
                        <Link
                          onClick={handleMobileLinkClick}
                          key={subidx}
                          to={`/paquetes?destino=${encodeURIComponent(ciudadSola)}`}
                          className="block px-4 py-2 text-sm text-light hover:text-primary-blue transition-colors"
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
                  className="block px-4 py-3 text-dark hover:bg-background-light hover:text-primary-blue rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <Link
            onClick={handleMobileLinkClick}
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