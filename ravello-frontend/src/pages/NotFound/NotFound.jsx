import { Link } from "react-router-dom";
import { ArrowLeft, Plane, MapPin, Compass, Navigation, Map } from "lucide-react";
import './NotFound'

export default function NotFoundPage() {
  return (
    <div 
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden select-none"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
      }}
    >
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating clouds */}
        <div className="absolute top-20 left-10 w-32 h-20 bg-white/40 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-24 bg-white/30 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-22 bg-white/35 rounded-full blur-xl animate-float"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Flying plane path */}
      <div className="absolute top-1/3 left-0 w-full h-1 opacity-10 pointer-events-none">
        <div className="relative w-full h-full">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 100">
            <path
              d="M0,50 Q250,20 500,50 T1000,50"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,10"
              className="animate-dash"
            />
          </svg>
          <div className="absolute top-0 left-0 animate-fly-across">
            <Plane size={24} className="text-blue-600 rotate-45" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          
          <div className="text-center mb-12">
            
            {/* Animated 404 */}
            <div className="relative inline-block mb-8">
              
              {/* Main 404 */}
              <div className="relative">
                <h1 className="text-[180px] md:text-[220px] font-black leading-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  404
                </h1>
                
                {/* Icons */}
                <div className="absolute -top-8 left-1/4 transform -translate-x-1/2 animate-float">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-12">
                    <Compass size={32} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="absolute top-1/3 -right-4 animate-bounce-slow">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-3xl">🧳</span>
                  </div>
                </div>
                
                <div className="absolute bottom-12 -left-8 animate-float-delayed">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center transform -rotate-12">
                    <MapPin size={28} className="text-red-500" />
                  </div>
                </div>

                <div className="absolute top-1/2 right-1/4 animate-spin-slow">
                  <div className="w-12 h-12 bg-white/80 backdrop-blur rounded-full shadow-md flex items-center justify-center">
                    <Navigation size={20} className="text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Dotted path */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 opacity-20">
                <div className="w-full h-full border-t-2 border-dashed border-blue-600"></div>
              </div>
            </div>

            {/* Text */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              ¡Vaya! Te saliste del mapa
            </h2>
            
            <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto">
              Parece que este destino no existe en nuestro itinerario
            </p>
            
            <p className="text-base text-slate-500 mb-10 max-w-xl mx-auto">
              La página que buscás puede haberse movido, eliminado o nunca haber existido. 
              Pero no te preocupes, siempre hay un camino de regreso.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="select-text group inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                           bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700
                           text-white font-semibold shadow-lg shadow-blue-500/30 
                           hover:shadow-xl hover:shadow-blue-500/40
                           transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Link>
              
              <Link
                to="/paquetes"
                className="select-text inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                           bg-white text-slate-700 font-semibold 
                           border-2 border-slate-200 hover:border-blue-500
                           hover:bg-blue-50 hover:text-blue-600
                           shadow-sm hover:shadow-md
                           transition-all duration-300"
              >
                <Map size={20} />
                Ver destinos
              </Link>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto">
            
            <Link to="/" className="select-text group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-lg">Inicio</h3>
              <p className="text-sm text-slate-600">Volvé a la página principal</p>
            </Link>

            <Link to="/paquetes" className="select-text group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-lg">Paquetes</h3>
              <p className="text-sm text-slate-600">Explorá nuestros destinos</p>
            </Link>

            <Link to="/contacto" className="select-text group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-lg">Ayuda</h3>
              <p className="text-sm text-slate-600">Contactanos para asistencia</p>
            </Link>

          </div>

        </div>
      </div>

      {/* Bottom decorations */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="rgba(59, 130, 246, 0.1)"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L0,120Z"
          />
          <path
            fill="rgba(99, 102, 241, 0.15)"
            d="M0,80L80,85.3C160,91,320,101,480,96C640,91,800,69,960,64C1120,59,1280,69,1360,74.7L1440,80L1440,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}
