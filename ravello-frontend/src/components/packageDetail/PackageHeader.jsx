import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2 } from "lucide-react";

export default function PackageHeader({ isFavorite, setIsFavorite }) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/paquetes"
              className="flex items-center gap-2 text-light hover:text-primary-blue transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver a paquetes</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition-all ${
                isFavorite
                  ? "bg-red-50 text-red-500"
                  : "bg-background-light text-light hover:bg-gray-200"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 rounded-full bg-background-light text-light hover:bg-gray-200 transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}