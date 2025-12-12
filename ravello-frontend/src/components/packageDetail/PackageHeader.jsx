import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2 } from "lucide-react";

export default function PackageHeader({ isFavorite, setIsFavorite }) {
  return (
    <div className="bg-white shadow-sm no-select">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 no-select">
        <div className="flex items-center justify-between no-select">

          {/* Botón volver */}
          <div className="flex items-center gap-4 no-select">
            <Link
              to="/paquetes"
              className="flex items-center gap-2 text-light hover:text-primary-blue transition-colors no-select"
            >
              <ArrowLeft size={20} className="no-select" />
              <span className="no-select">Volver a paquetes</span>
            </Link>
          </div>

          {/* Favorito + Compartir */}
          <div className="flex items-center gap-3 no-select">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition-all no-select ${isFavorite
                  ? "bg-red-50 text-red-500"
                  : "bg-background-light text-light hover:bg-gray-200"
                }`}
            >
              <Heart
                size={20}
                fill={isFavorite ? "currentColor" : "none"}
                className="no-select"
              />
            </button>

            <button className="p-2 rounded-full bg-background-light text-light hover:bg-gray-200 transition-all no-select">
              <Share2 size={20} className="no-select" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
