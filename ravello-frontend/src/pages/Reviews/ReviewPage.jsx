import React, { useState } from "react";
import { Star, Sparkles, CheckCircle2, User, MessageSquare, Award, Heart, Plane, Compass } from "lucide-react";
import './ReviewPage.css'

const ReviewForm = ({ packageId, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    calificacion: 0,
    comentario: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "Debe tener al menos 2 caracteres";
    }
    
    if (!formData.calificacion || formData.calificacion < 1) {
      newErrors.calificacion = "Selecciona una calificación";
    }
    
    if (formData.comentario && formData.comentario.length > 500) {
      newErrors.comentario = "Máximo 500 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleStarClick = (star) => {
    setFormData(prev => ({ ...prev, calificacion: star }));
    if (errors.calificacion) {
      setErrors(prev => ({ ...prev, calificacion: "" }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulación de envío - reemplazar con tu API real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({
        nombre: "",
        calificacion: 0,
        comentario: ""
      });
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-all duration-300 hover:scale-125 active:scale-95"
        >
          <Star
            size={window.innerWidth < 640 ? 28 : 36}
            className={`${
              star <= (hoveredStar || formData.calificacion)
                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                : "text-gray-300"
            } transition-all duration-200`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="no-select fade-top-bottom relative w-full min-h-screen py-12 sm:py-16 md:py-20 px-4 overflow-hidden bg-gradient-to-br from-[#F7F7F7] via-[#FFFFFF] to-[#F5E0B3]">
      
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30 10 L35 25 L50 25 L38 35 L42 50 L30 40 L18 50 L22 35 L10 25 L25 25 Z" fill="%231C77B7" opacity="0.3"/></svg>')`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Elementos decorativos animados */}
      <div className="absolute top-10 left-[5%] opacity-10 pointer-events-none hidden sm:block">
        <Plane className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 text-[#1C77B7]" style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>
      <div className="absolute top-32 right-[8%] opacity-10 pointer-events-none hidden md:block">
        <Compass className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-[#34B0D9]" style={{ animation: 'float 10s ease-in-out infinite 2s' }} />
      </div>
      <div className="absolute bottom-20 right-[10%] opacity-10 pointer-events-none hidden sm:block">
        <Heart className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 text-[#E33D35]" style={{ animation: 'float 9s ease-in-out infinite 1s' }} />
      </div>
      
      {/* Mesh gradient decorativo mejorado */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad1" cx="15%" cy="20%">
            <stop offset="0%" style={{ stopColor: '#1C77B7', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#1C77B7', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="grad2" cx="85%" cy="80%">
            <stop offset="0%" style={{ stopColor: '#E33D35', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#E33D35', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="grad3" cx="50%" cy="50%">
            <stop offset="0%" style={{ stopColor: '#34B0D9', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#34B0D9', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <circle cx="15%" cy="20%" r="400" fill="url(#grad1)" />
        <circle cx="85%" cy="80%" r="450" fill="url(#grad2)" />
        <circle cx="50%" cy="50%" r="350" fill="url(#grad3)" />
      </svg>

      <div className="relative max-w-3xl mx-auto">
        {/* Header con glassmorphism mejorado */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 relative">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-md bg-white/60 border-2 border-white/80 shadow-xl pointer-events-none">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#E33D35]" />
            <span className="text-xs sm:text-sm font-bold text-[#1C77B7] uppercase tracking-wide">Tu Opinión Importa</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#34B0D9]" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 md:mb-5 bg-gradient-to-r from-[#1C77B7] via-[#34B0D9] to-[#1C77B7] bg-clip-text text-transparent drop-shadow-sm">
            Comparte tu Experiencia
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#666666] max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Tu opinión ayuda a otros viajeros a vivir experiencias inolvidables
            <span className="block text-[#1C77B7] font-semibold mt-2">¡Cuéntanos cómo fue tu aventura!</span>
          </p>
        </div>

        {submitted ? (
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 border-2 border-white shadow-2xl rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-center transform transition-all duration-500 hover:scale-105">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#34B0D9] mb-4 sm:mb-6 shadow-xl" style={{ animation: 'bounce 1s ease-in-out 3' }}>
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-[#1C77B7] mb-3 sm:mb-4">
              ¡Gracias por tu Opinión!
            </h3>
            <p className="text-[#666666] text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
              Tu reseña será publicada una vez aprobada. Apreciamos que compartas tu experiencia con otros viajeros.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#1C77B7] to-[#34B0D9] text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Dejar otra opinión
            </button>
          </div>
        ) : (
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/85 to-white/70 border-2 border-white/90 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8">
            
            {/* Nombre */}
            <div className="relative group">
              <label className="block text-[#1C77B7] font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('nombre')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tu nombre"
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none transition-all duration-300 ${
                    focusedField === 'nombre'
                      ? 'border-[#1C77B7] bg-white scale-[1.02]'
                      : 'border-[#DDDDDD] bg-[#F7F7F7]/50'
                  }`}
                />
                {focusedField === 'nombre' && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1C77B7]/20 to-[#34B0D9]/20 -z-10 blur-xl" />
                )}
              </div>
              {errors.nombre && (
                <p className="text-[#E33D35] text-sm mt-2 flex items-center gap-1 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E33D35]" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Calificación */}
            <div className="relative group">
              <label className="block text-[#1C77B7] font-bold mb-4 sm:mb-5 text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Tu Calificación
              </label>
              
              <div className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#F5E0B3]/20 to-white/50 border-2 border-[#F5E0B3]/50">
                {renderStars()}
                
                {formData.calificacion > 0 && (
                  <p className="text-[#1C77B7] text-sm sm:text-base mt-3 sm:mt-4 text-center font-semibold">
                    {formData.calificacion === 5 && "⭐ ¡Excelente!"}
                    {formData.calificacion === 4 && "😊 Muy bueno"}
                    {formData.calificacion === 3 && "👍 Bueno"}
                    {formData.calificacion === 2 && "😐 Regular"}
                    {formData.calificacion === 1 && "😞 Mejorable"}
                  </p>
                )}
              </div>
              
              {errors.calificacion && (
                <p className="text-[#E33D35] text-sm mt-2 flex items-center gap-1 font-medium justify-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E33D35]" />
                  {errors.calificacion}
                </p>
              )}
            </div>

            {/* Comentario */}
            <div className="relative group">
              <label className="block text-[#1C77B7] font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Tu Opinión <span className="text-[#666666] text-xs normal-case font-normal ml-1">(opcional)</span>
              </label>
              <div className="relative">
                <textarea
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('comentario')}
                  onBlur={() => setFocusedField(null)}
                  rows="5"
                  placeholder="Cuéntanos sobre tu experiencia, qué te gustó más, qué recomendarías..."
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none resize-none transition-all duration-300 ${
                    focusedField === 'comentario'
                      ? 'border-[#1C77B7] bg-white scale-[1.01]'
                      : 'border-[#DDDDDD] bg-[#F7F7F7]/50'
                  }`}
                />
                {focusedField === 'comentario' && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1C77B7]/20 via-[#34B0D9]/20 to-[#E33D35]/10 -z-10 blur-xl" />
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#999999] text-xs sm:text-sm">
                  {formData.comentario?.length || 0} / 500 caracteres
                </p>
                {errors.comentario && (
                  <p className="text-[#E33D35] text-xs sm:text-sm font-medium">
                    {errors.comentario}
                  </p>
                )}
              </div>
            </div>

            {/* Botón de envío mejorado */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="group relative w-full py-5 sm:py-6 rounded-2xl font-black text-lg sm:text-xl text-white shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(28,119,183,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #1C77B7 0%, #34B0D9 50%, #E33D35 100%)',
                backgroundSize: '200% 100%',
                animation: isSubmitting ? 'shimmer 2s infinite' : 'none'
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando tu opinión...
                  </>
                ) : (
                  <>
                    Enviar mi Opinión
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                  </>
                )}
              </span>
              
              {!isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>

            {/* Info adicional mejorada */}
            <div className="flex items-center justify-center gap-3 pt-2 sm:pt-4 pb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DDDDDD] to-transparent" />
              <p className="text-center text-xs sm:text-sm text-[#1C77B7] font-semibold px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#F5E0B3]/30 to-[#F5E0B3]/10">
                🔒 Las opiniones son moderadas antes de publicarse
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DDDDDD] to-transparent" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;