import { Link } from "react-router-dom";
import { ArrowLeft, Globe2 } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-light"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >


      {/* Gradient Mesh de fondo */}
      <div className="absolute inset-0 gradient-mesh-ravello opacity-60 pointer-events-none"></div>

      {/* Fade superior */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-20"></div>

      {/* Fade inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"></div>

      {/* Contenedor principal */}
      <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-20">

        {/* Ícono */}
        <div className="flex justify-center mb-8">
          <div
            className="p-6 rounded-full shadow-lg"
            style={{ backgroundColor: "var(--color-background-white)" }}
          >
            <Globe2
              size={60}
              strokeWidth={1.4}
              style={{ color: "var(--color-primary-blue)" }}
            />
          </div>
        </div>

        {/* Título */}
        <h1
          className="text-7xl font-bold mb-4"
          style={{ color: "var(--color-primary-blue)" }}
        >
          404
        </h1>

        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: "var(--color-text-dark)" }}
        >
          Parece que este destino no existe
        </h2>

        {/* Texto descriptivo */}
        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: "var(--color-text-light)" }}
        >
          Puede que esta página se haya movido, haya sido eliminada o simplemente
          estés explorando un lugar desconocido.
          Regresemos juntos a un destino seguro.
        </p>

        {/* Botón */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white transition-all shadow-md hover:shadow-lg hover:scale-[1.03]"
            style={{ backgroundColor: "var(--color-primary-blue)" }}
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Wave decorativa */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30 pointer-events-none select-none">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="var(--color-secondary-cyan)"
            fillOpacity="0.4"
            d="M0,96L80,112C160,128,320,160,480,144C640,128,800,64,960,42.7C1120,21,1280,43,1360,53.3L1440,64L1440,320L0,320Z"
          ></path>
        </svg>
      </div>
      
    </div>
  );
}
