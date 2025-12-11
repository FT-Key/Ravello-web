import React from "react";
import { Link } from "react-router-dom";

export default function NotFound({ 
  message = "Contenido no encontrado", 
  linkText = "Volver", 
  linkTo = "/" 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center select-none">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">
          {message}
        </h2>

        <Link 
          to={linkTo} 
          className="text-primary-blue hover:underline cursor-pointer select-text"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
