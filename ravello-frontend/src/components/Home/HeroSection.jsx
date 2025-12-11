import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./HeroSection.css";

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const parallaxBg = heroRef.current.querySelector(".hero-bg");
        if (parallaxBg) {
          parallaxBg.style.transform = `scale(1.2) translateY(${scrolled * 0.5}px)`;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/paquetes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/paquetes");
    }
  };

  return (
    <div ref={heroRef} className="hero-section no-select">
      {/* Background con imagen, gradiente y parallax */}
      <div className="hero-bg-wrapper">
        <div className="hero-bg" />
        <div className="hero-overlay" />
      </div>

      {/* Contenido principal */}
      <div className="hero-content" data-aos="fade-up">
        
        {/* Título */}
        <h1 className="hero-title no-select">
          Viajá donde siempre soñaste
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle no-select">
          Paquetes exclusivos, precios increíbles, atención personalizada
        </p>

        {/* Barra de búsqueda */}
        <div className="hero-search-wrapper" data-aos="zoom-in" data-aos-delay="200">
          <form onSubmit={handleSearch} className="hero-search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿A dónde querés viajar?"
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-button">
              <Search className="hero-search-icon no-select" />
              <span className="hero-search-text no-select">Buscar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="hero-scroll-indicator no-select">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
