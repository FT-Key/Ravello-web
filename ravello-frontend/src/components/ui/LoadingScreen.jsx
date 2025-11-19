import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ isExiting }) {
  return (
    <div className={`loading-wrapper ${isExiting ? "exit" : ""}`}>
      <div className="loading-gradient"></div>

      <div className="loading-logo-container">
        <img src="/ravello-logo.png" alt="Ravello" className="loading-logo" />
        <span className="loading-text">Administramos buenos momentos</span>
      </div>
    </div>
  );
}
