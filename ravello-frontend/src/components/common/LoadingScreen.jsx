// src/components/common/LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      {/* Fondo con formas decorativas */}
      <div className="loading-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Contenido central */}
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo">
          <img 
            src="/ravello-mini-logo.svg" 
            alt="Ravello" 
            className="logo-image"
          />
          <h1 className="logo-text">
            Ra<span className="logo-accent">v</span>ello
          </h1>
        </div>

        {/* Avión animado */}
        <div className="plane-container">
          <svg 
            className="plane-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" 
              fill="currentColor"
            />
          </svg>
          <div className="plane-trail"></div>
        </div>

        {/* Texto de carga */}
        <div className="loading-text">
          <p className="loading-message">Verificando sesión</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      {/* Nubes decorativas */}
      <div className="clouds">
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
      </div>
    </div>
  );
};

export default LoadingScreen;