import React from "react";
import "./LoadingSpinner.css";

export default function LoadingSpinner({ message = "Cargando...", variant = "default" }) {
  
  // Variant "default" - Para páginas completas
  if (variant === "default") {
    return (
      <div className="loading-spinner-container">
        {/* Formas de fondo animadas */}
        <div className="spinner-bg-shapes">
          <div className="spinner-shape spinner-shape-1"></div>
          <div className="spinner-shape spinner-shape-2"></div>
          <div className="spinner-shape spinner-shape-3"></div>
        </div>

        {/* Contenido central */}
        <div className="spinner-content">
          {/* Avión girando */}
          <div className="plane-spinner">
            <svg 
              className="plane-icon-spin" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" 
                fill="currentColor"
              />
            </svg>
            
            {/* Círculo de órbita */}
            <div className="orbit-circle"></div>
          </div>

          {/* Texto de carga */}
          <p className="spinner-message">{message}</p>
          
          {/* Puntos animados */}
          <div className="spinner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  // Variant "inline" - Para dentro de cards o secciones
  if (variant === "inline") {
    return (
      <div className="spinner-inline">
        <div className="plane-spinner-small">
          <svg 
            className="plane-icon-spin-small" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" 
              fill="currentColor"
            />
          </svg>
          <div className="orbit-circle-small"></div>
        </div>
        {message && <p className="spinner-message-small">{message}</p>}
      </div>
    );
  }

  // Variant "minimal" - Solo el spinner sin texto
  if (variant === "minimal") {
    return (
      <div className="spinner-minimal">
        <div className="compass-spinner">
          <div className="compass-needle"></div>
          <div className="compass-circle"></div>
        </div>
      </div>
    );
  }

  return null;
}