import React, { useState } from "react";
import { Send, MapPin, Plane, Sparkles, CheckCircle2, Mail, User, Phone, MessageSquare, Compass } from "lucide-react";
import './ContactPage.css'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (formData.telefono && !/^\+?[0-9\s\-]{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = "Teléfono inválido";
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio";
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulación de envío - reemplazar con tu API real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: ""
      });
    } catch (error) {
      setErrorMsg("Ocurrió un error al enviar el mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="no-select fade-top-bottom relative w-full min-h-screen py-20 px-4 overflow-hidden bg-gradient-to-br from-[#F7F7F7] via-[#FFFFFF] to-[#F5E0B3]">
      
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30 10 L35 25 L50 25 L38 35 L42 50 L30 40 L18 50 L22 35 L10 25 L25 25 Z" fill="%231C77B7" opacity="0.3"/></svg>')`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Elementos decorativos animados */}
      <div className="absolute top-10 left-[5%] opacity-10 pointer-events-none">
        <Plane className="w-40 h-40 text-[#1C77B7]" style={{ animation: 'float 8s ease-in-out infinite' }} />
      </div>
      <div className="absolute top-32 right-[8%] opacity-10 pointer-events-none">
        <Compass className="w-32 h-32 text-[#34B0D9]" style={{ animation: 'float 10s ease-in-out infinite 2s' }} />
      </div>
      <div className="absolute bottom-20 right-[10%] opacity-10 pointer-events-none">
        <MapPin className="w-36 h-36 text-[#E33D35]" style={{ animation: 'float 9s ease-in-out infinite 1s' }} />
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

      <div className="relative max-w-6xl mx-auto">
        {/* Header con glassmorphism mejorado */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full backdrop-blur-md bg-white/60 border-2 border-white/80 shadow-xl pointer-events-none">
            <Sparkles className="w-5 h-5 text-[#E33D35]" />
            <span className="text-sm font-bold text-[#1C77B7] uppercase tracking-wide">Tu Próxima Aventura Comienza Aquí</span>
            <Sparkles className="w-5 h-5 text-[#34B0D9]" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-5 bg-gradient-to-r from-[#1C77B7] via-[#34B0D9] to-[#1C77B7] bg-clip-text text-transparent drop-shadow-sm">
            Contáctanos
          </h2>
          <p className="text-xl md:text-2xl text-[#666666] max-w-3xl mx-auto font-medium leading-relaxed">
            ¿Listo para vivir experiencias inolvidables? 
            <span className="block text-[#1C77B7] font-semibold mt-2">Cuéntanos tu destino soñado y nosotros nos encargamos del resto</span>
          </p>
        </div>

        {submitted ? (
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-white/60 border-2 border-white shadow-2xl rounded-3xl p-12 text-center transform transition-all duration-500 hover:scale-105">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#34B0D9] mb-6 shadow-xl" style={{ animation: 'bounce 1s ease-in-out 3' }}>
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <h3 className="text-4xl font-black text-[#1C77B7] mb-4">
              ¡Mensaje Enviado!
            </h3>
            <p className="text-[#666666] text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Nos pondremos en contacto contigo muy pronto para comenzar a planificar tu viaje perfecto.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#1C77B7] to-[#34B0D9] text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/85 to-white/70 border-2 border-white/90 shadow-2xl rounded-3xl p-8 md:p-12 space-y-8">
            
            {/* Grid de campos */}
            <div className="grid md:grid-cols-2 gap-6">
              
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
                    placeholder="Juan Pérez"
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none transition-all duration-300 ${
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

              {/* Email */}
              <div className="relative group">
                <label className="block text-[#1C77B7] font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="juan@ejemplo.com"
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'email'
                        ? 'border-[#1C77B7] bg-white scale-[1.02]'
                        : 'border-[#DDDDDD] bg-[#F7F7F7]/50'
                    }`}
                  />
                  {focusedField === 'email' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1C77B7]/20 to-[#34B0D9]/20 -z-10 blur-xl" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-[#E33D35] text-sm mt-2 flex items-center gap-1 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E33D35]" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="relative group">
                <label className="block text-[#1C77B7] font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono <span className="text-[#666666] text-xs normal-case font-normal ml-1">(opcional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('telefono')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="+54 9 381 000 0000"
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'telefono'
                        ? 'border-[#34B0D9] bg-white scale-[1.02]'
                        : 'border-[#DDDDDD] bg-[#F7F7F7]/50'
                    }`}
                  />
                  {focusedField === 'telefono' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#34B0D9]/20 to-[#1C77B7]/20 -z-10 blur-xl" />
                  )}
                </div>
                {errors.telefono && (
                  <p className="text-[#E33D35] text-sm mt-2 flex items-center gap-1 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E33D35]" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              {/* Asunto */}
              <div className="relative group">
                <label className="block text-[#1C77B7] font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Asunto
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('asunto')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Consulta sobre viajes a Europa"
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'asunto'
                        ? 'border-[#34B0D9] bg-white scale-[1.02]'
                        : 'border-[#DDDDDD] bg-[#F7F7F7]/50'
                    }`}
                  />
                  {focusedField === 'asunto' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#34B0D9]/20 to-[#1C77B7]/20 -z-10 blur-xl" />
                  )}
                </div>
              </div>
            </div>

            {/* Mensaje - Full width */}
            <div className="relative group">
              <label className="block text-[#1C77B7] font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Cuéntanos sobre tu viaje ideal
              </label>
              <div className="relative">
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('mensaje')}
                  onBlur={() => setFocusedField(null)}
                  rows="6"
                  placeholder="Describe tu destino soñado, fechas tentativas, número de viajeros y cualquier otra información que nos ayude a crear tu experiencia perfecta..."
                  className={`w-full px-5 py-4 rounded-2xl border-2 text-[#333333] placeholder-[#999999] shadow-md focus:shadow-xl focus:outline-none resize-none transition-all duration-300 ${
                    focusedField === 'mensaje'
                      ? 'border-[#1C77B7] bg-white scale-[1.01]'
                      : 'border-[#DDDDDD] bg-[#F7F7F7]/50'
                  }`}
                />
                {focusedField === 'mensaje' && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1C77B7]/20 via-[#34B0D9]/20 to-[#E33D35]/10 -z-10 blur-xl" />
                )}
              </div>
              {errors.mensaje && (
                <p className="text-[#E33D35] text-sm mt-2 flex items-center gap-1 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E33D35]" />
                  {errors.mensaje}
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-[#E33D35]/10 border-2 border-[#E33D35]/30 backdrop-blur-sm">
                <p className="text-[#E33D35] text-sm font-bold">{errorMsg}</p>
              </div>
            )}

            {/* Botón de envío mejorado */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="group relative w-full py-6 rounded-2xl font-black text-xl text-white shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(28,119,183,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #1C77B7 0%, #34B0D9 50%, #E33D35 100%)',
                backgroundSize: '200% 100%',
                animation: isSubmitting ? 'shimmer 2s infinite' : 'none'
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando tu mensaje...
                  </>
                ) : (
                  <>
                    Comenzar Mi Aventura
                    <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
              </span>
              
              {!isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>

            {/* Info adicional mejorada */}
            <div className="flex items-center justify-center gap-3 pt-4 pb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DDDDDD] to-transparent" />
              <p className="text-center text-sm text-[#1C77B7] font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-[#F5E0B3]/30 to-[#F5E0B3]/10">
                ⚡ Responderemos en menos de 24 horas
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DDDDDD] to-transparent" />
            </div>
          </div>
        )}


      </div>
    </div>
  );
}