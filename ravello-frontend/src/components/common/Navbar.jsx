import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Mail, Facebook, Instagram, Twitter, Globe, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Destinos", submenu: ["Europa", "América", "Asia", "África", "Oceanía", "Caribe"] },
    { label: "Paquetes", link: "/paquetes" },
    { label: "Experiencias", submenu: ["Cruceros", "Circuitos", "City Tours", "Escapadas"] },
    { label: "Ofertas", link: "/ofertas" },
    { label: "Nosotros", link: "/sobre-nosotros" },
    { label: "Contacto", link: "/contacto" },
    { label: "Opiniones", link: "/opiniones" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      {/* Barra superior */}
      <div className={`transition-all duration-500 overflow-hidden ${isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm py-2 border-b border-white border-opacity-20">
            <div className="flex items-center gap-6 text-white">
              <a href="tel:+5491123456789" className="flex items-center gap-2 hover:text-secondary-cyan transition-colors">
                <Phone size={14} />
                <span>+54 911 2345-6789</span>
              </a>
              <a href="mailto:info@ravello.com" className="flex items-center gap-2 hover:text-secondary-cyan transition-colors">
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
                <a href="#" className="text-white hover:text-secondary-cyan transition-colors" aria-label="Facebook"><Facebook size={16} /></a>
                <a href="#" className="text-white hover:text-secondary-cyan transition-colors" aria-label="Instagram"><Instagram size={16} /></a>
                <a href="#" className="text-white hover:text-secondary-cyan transition-colors" aria-label="Twitter"><Twitter size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <svg width="50" height="50" viewBox="0 0 50 50" className="transition-transform group-hover:scale-110 duration-300">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#1C77B7', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#34B0D9', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M25 10 L35 25 L45 22 L25 30 L5 22 L15 25 Z" fill="url(#logoGradient)" />
                <circle cx="25" cy="25" r="18" fill="none" stroke="#E33D35" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" style={{ animationDuration: '20s' }} />
                <path d="M25 30 Q20 35, 15 32" fill="none" stroke="#34B0D9" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.6" />
              </svg>
            </div>
            <div>
              <h1 className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-primary-blue' : 'text-white'}`}>Ravello</h1>
              <p className={`text-xs transition-colors ${isScrolled ? 'text-light' : 'text-white text-opacity-90'}`}>Viajá sin límites</p>
            </div>
          </Link>

          {/* Menú Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, idx) => (
              <div key={idx} className="relative group" onMouseEnter={() => setActiveDropdown(idx)} onMouseLeave={() => setActiveDropdown(null)}>
                {item.submenu ? (
                  <>
                    <button className={`px-4 py-2 font-medium transition-all rounded-lg flex items-center gap-1 ${isScrolled ? 'text-dark hover:text-primary-blue hover:bg-background-light' : 'text-white hover:text-secondary-cyan hover:bg-white hover:bg-opacity-10'}`}>
                      {item.label} <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                    </button>
                    <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${activeDropdown === idx ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                      {item.submenu.map((subitem, subidx) => (
                        <a key={subidx} href="#" className="block px-6 py-3 text-dark hover:bg-background-light hover:text-primary-blue transition-colors border-b border-border-subtle last:border-b-0">
                          {subitem}
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link to={item.link} className={`px-4 py-2 font-medium transition-all rounded-lg ${isScrolled ? 'text-dark hover:text-primary-blue hover:bg-background-light' : 'text-white hover:text-secondary-cyan hover:bg-white hover:bg-opacity-10'}`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contacto" className="px-6 py-2 rounded-full border-2 border-primary-red text-primary-red font-semibold hover:bg-primary-red hover:text-white transition-all">
              Cotizar viaje
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-dark hover:bg-background-light' : 'text-white hover:bg-white hover:bg-opacity-10'}`} aria-label="Menú">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-2">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <>
                  <button className="w-full text-left px-4 py-3 text-dark font-medium rounded-lg">{item.label}</button>
                  <div className="pl-4 mt-1 space-y-1">
                    {item.submenu.map((subitem, subidx) => (
                      <a key={subidx} href="#" className="block px-4 py-2 text-sm text-light hover:text-primary-blue transition-colors">{subitem}</a>
                    ))}
                  </div>
                </>
              ) : (
                <Link to={item.link} className="block px-4 py-3 text-dark hover:bg-background-light hover:text-primary-blue rounded-lg transition-colors font-medium">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link to="/contacto" className="w-full mt-4 px-6 py-3 rounded-full bg-primary-red text-white font-semibold hover:bg-opacity-90 transition-all">
            Cotizar viaje
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
