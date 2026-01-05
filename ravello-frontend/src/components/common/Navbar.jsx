// src/components/common/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Mail, Globe, ChevronDown } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import clientAxios from "../../api/axiosConfig";
import { useUserStore } from "../../stores/useUserStore";
import Topbar from "./Navbar/Topbar";
import DesktopMenu from "./Navbar/DesktopMenu";
import MobileMenu from "./Navbar/MobileMenu";
import AuthSection from "./Navbar/AuthSection";

const Navbar = ({ position = "sticky" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [destinos, setDestinos] = useState([]);
  const [topbarClickable, setTopbarClickable] = useState(true);
  
  const { user, loadingUser } = useUserStore();

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
    if (!isScrolled) {
      setTopbarClickable(false);
      const timer = setTimeout(() => setTopbarClickable(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú mobile está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      
      // Aplicar estilos para bloquear el scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Mantiene el ancho de la scrollbar
    } else {
      // Restaurar el scroll cuando se cierra el menú
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      // Restaurar la posición del scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isMobileMenuOpen]);

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
      return "bg-white/60 backdrop-blur-xl border border-white/10 shadow-lg";

    if (position === "fixed") return "bg-transparent";

    return "bg-black/90 backdrop-blur-md border-b border-black/60";
  };

  return (
    <nav
      id="main-navbar"
      className={`${position} top-0 left-0 right-0 z-50 min-h-[115px] transition-all duration-300`}
    >
      <div
        className={`
        transition-all duration-300
        ${getNavbarBackground()}
        ${!isScrolled && position !== "fixed" ? "bg-[url('/navbar/nav-bg.jpg')] bg-cover bg-bottom" : ""}
        ${isScrolled ? "w-full sm:w-[95%] mx-auto rounded-b-2xl shadow-xl backdrop-blur-md border border-black/10" : "w-full"}
      `}
      >
        {/* Topbar */}
        <Topbar 
          isScrolled={isScrolled} 
          topbarClickable={topbarClickable}
        />

        {/* NAVBAR PRINCIPAL */}
        <div className={`max-w-7xl mx-auto px-4 ${isScrolled ? "py-2" : "py-4"} transition-all duration-300`}>
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link onClick={handleMobileLinkClick} to="/" className="flex items-center gap-2 group no-select">
              <div className="relative">
                <img src="/ravello-mini-logo.svg" alt="Ravello Logo" className="w-[50px] h-[50px] object-contain transition-transform duration-300 group-hover:scale-110 no-select" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors no-select ${isScrolled ? "text-primary-blue" : "text-white"}`}>
                  Ra<span className={`${isScrolled ? "text-primary-red" : "text-white"} no-select`}>v</span>ello
                </h1>
                <p className={`text-xs transition-colors max-w-[120px] whitespace-normal break-words no-select ${isScrolled ? "text-light" : "text-white text-opacity-90"}`}>
                  Administramos buenos momentos
                </p>
              </div>
            </Link>

            {/* MENÚ DESKTOP */}
            <DesktopMenu 
              menuItems={menuItems}
              isScrolled={isScrolled}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              handleMobileLinkClick={handleMobileLinkClick}
            />

            {/* CTA + AUTH */}
            <div className="hidden lg:flex items-center gap-3">
            {/*   <Link
                onClick={handleMobileLinkClick}
                to="/contacto"
                className="px-6 py-2 rounded-full border-2 border-[var(--color-primary-red)] text-[var(--color-primary-red)] font-semibold hover:bg-[var(--color-primary-red)] hover:text-white transition-all duration-300 no-select"
              >
                Cotizar viaje
              </Link> */}
              
              <AuthSection 
                user={user} 
                loadingUser={loadingUser} 
                isScrolled={isScrolled}
              />
            </div>

            {/* Botón Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors no-select ${isScrolled ? "text-dark hover:bg-background-light" : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      <MobileMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        menuItems={menuItems}
        mobileDropdowns={mobileDropdowns}
        toggleMobileDropdown={toggleMobileDropdown}
        handleMobileLinkClick={handleMobileLinkClick}
        user={user}
        loadingUser={loadingUser}
      />
    </nav>
  );
};

export default Navbar;