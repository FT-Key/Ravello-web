import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Check, X } from "lucide-react";

export default function PackageHeader({ pkg, isFavorite, setIsFavorite }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = pkg?.nombre || "Paquete turístico";
    const text = pkg?.descripcionCorta || "Mira este increíble paquete de viaje";

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => {
            setCopySuccess(false);
            setShowShareMenu(false);
          }, 2000);
        } catch (err) {
          console.error("Error al copiar:", err);
        }
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title}\n${text}\n${url}`)}`,
          "_blank"
        );
        setShowShareMenu(false);
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
        setShowShareMenu(false);
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank",
          "width=600,height=400"
        );
        setShowShareMenu(false);
        break;

      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        setShowShareMenu(false);
        break;

      default:
        break;
    }
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-40 no-select">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 no-select">
        <div className="flex items-center justify-between gap-4 no-select">

          {/* Botón volver */}
          <div className="flex items-center gap-4 no-select min-w-0 flex-1 sm:flex-initial">
            <Link
              to="/paquetes"
              className="flex items-center gap-2 text-light hover:text-primary-blue transition-colors no-select group"
            >
              <ArrowLeft size={20} className="no-select flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              <span className="no-select hidden sm:inline">Volver a paquetes</span>
              <span className="no-select sm:hidden">Volver</span>
            </Link>
          </div>

          {/* Título del paquete (opcional, en pantallas grandes) */}
          {pkg?.nombre && (
            <div className="hidden md:block flex-1 min-w-0 px-4">
              <h1 className="text-lg font-semibold text-dark truncate" title={pkg.nombre}>
                {pkg.nombre}
              </h1>
            </div>
          )}

          {/* Favorito + Compartir */}
          <div className="flex items-center gap-2 sm:gap-3 no-select relative">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition-all no-select group relative ${
                isFavorite
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-background-light text-light hover:bg-gray-200"
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart
                size={20}
                fill={isFavorite ? "currentColor" : "none"}
                className={`no-select transition-transform ${isFavorite ? "scale-110" : "group-hover:scale-110"}`}
              />
            </button>

            {/* Botón compartir con menú */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full bg-background-light text-light hover:bg-gray-200 transition-all no-select group"
                title="Compartir"
              >
                <Share2 size={20} className="no-select group-hover:scale-110 transition-transform" />
              </button>

              {/* Menú de compartir */}
              {showShareMenu && (
                <>
                  {/* Overlay para cerrar al hacer click afuera */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowShareMenu(false)}
                  />

                  {/* Menú desplegable */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-dark">Compartir paquete</p>
                    </div>

                    {copySuccess ? (
                      <div className="px-4 py-3 flex items-center gap-2 text-green-600">
                        <Check size={16} />
                        <span className="text-sm font-medium">¡Enlace copiado!</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleShare("copy")}
                          className="w-full px-4 py-2 text-left text-sm text-dark hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            🔗
                          </div>
                          <span>Copiar enlace</span>
                        </button>

                        <button
                          onClick={() => handleShare("whatsapp")}
                          className="w-full px-4 py-2 text-left text-sm text-dark hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💬</span>
                          </div>
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleShare("facebook")}
                          className="w-full px-4 py-2 text-left text-sm text-dark hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">📘</span>
                          </div>
                          <span>Facebook</span>
                        </button>

                        <button
                          onClick={() => handleShare("twitter")}
                          className="w-full px-4 py-2 text-left text-sm text-dark hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🐦</span>
                          </div>
                          <span>Twitter</span>
                        </button>

                        <button
                          onClick={() => handleShare("email")}
                          className="w-full px-4 py-2 text-left text-sm text-dark hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">📧</span>
                          </div>
                          <span>Email</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100 mt-1"
                    >
                      <X size={16} className="ml-2" />
                      <span>Cerrar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}