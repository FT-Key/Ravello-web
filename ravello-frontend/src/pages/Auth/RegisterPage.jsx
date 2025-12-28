import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, UserPlus, Plane, MapPin, Compass, Mail, User, Lock, CheckCircle } from "lucide-react";
import clientAxios from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import './auth.css';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      // Preparar datos para el registro
      const registerData = {
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido
      };

      const res = await clientAxios.post("/auth/register", registerData);

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        toast.error("Error inesperado: respuesta incompleta");
        return;
      }

      setUser(user);
      setToken(token);

      toast.success("¡Registro exitoso! Bienvenido a Ravello");

      // Redirigir al perfil para completar información
      navigate("/mi-perfil");

    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Error al crear la cuenta"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Decorative animated elements */}
      <div className="absolute top-20 right-10 opacity-10 animate-float">
        <Compass size={120} className="text-purple-600 rotate-45" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10 animate-float-delayed">
        <Plane size={100} className="text-pink-600" />
      </div>
      <div className="absolute top-1/2 right-1/4 opacity-5 animate-pulse">
        <MapPin size={80} className="text-purple-500" />
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Left side - Visual/Branding */}
          <div className="hidden md:block relative bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 overflow-hidden">

            {/* Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-center p-12 text-white">

              {/* Main illustration */}
              <div className="mb-8 relative">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center
                                shadow-2xl border border-white/20">
                  <UserPlus size={64} className="text-white animate-float" />
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce"></div>
              </div>

              <h3 className="text-3xl font-bold mb-4 text-center">
                Comenzá tu aventura
              </h3>
              <p className="text-purple-100 text-center mb-8 max-w-md leading-relaxed">
                Creá tu cuenta y accedé a experiencias únicas alrededor del mundo
              </p>

              {/* Feature list */}
              <div className="space-y-4 w-full max-w-sm">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold">Registro rápido</p>
                    <p className="text-xs text-purple-100">Solo toma 2 minutos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ofertas exclusivas</p>
                    <p className="text-xs text-purple-100">Descuentos para nuevos usuarios</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <div>
                    <p className="font-semibold">100% seguro</p>
                    <p className="text-xs text-purple-100">Tus datos están protegidos</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating shapes decoration */}
            <div className="absolute bottom-10 left-10 w-20 h-20 border-4 border-white/30 rounded-full animate-spin-slow"></div>
            <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl rotate-12 animate-float"></div>

          </div>

          {/* Right side - Register Form */}
          <div className="relative p-8 md:p-12 flex flex-col justify-center bg-white z-10">

            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Plane size={20} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ravello
                </h1>
              </div>
              <p className="text-slate-600 text-sm">Tu próxima aventura comienza aquí</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Crear cuenta
              </h2>
              <p className="text-slate-500 text-sm">
                Completá tus datos para comenzar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Juan"
                      {...register("nombre", { 
                        required: "El nombre es obligatorio",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" }
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 
                                 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 
                                 outline-none text-slate-800 transition-all duration-200
                                 placeholder:text-slate-400"
                    />
                  </div>
                  {errors.nombre && (
                    <p className="text-xs mt-1.5 text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span>
                      {errors.nombre.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Pérez"
                      {...register("apellido", { 
                        required: "El apellido es obligatorio",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" }
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 
                                 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 
                                 outline-none text-slate-800 transition-all duration-200
                                 placeholder:text-slate-400"
                    />
                  </div>
                  {errors.apellido && (
                    <p className="text-xs mt-1.5 text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠️</span>
                      {errors.apellido.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email", { 
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo inválido"
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 
                               focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 
                               outline-none text-slate-800 transition-all duration-200
                               placeholder:text-slate-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs mt-1.5 text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "La contraseña es obligatoria",
                      minLength: { value: 8, message: "Mínimo 8 caracteres" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Debe incluir mayúscula, minúscula y número"
                      }
                    })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border-2 border-slate-200
                               focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 
                               outline-none text-slate-800 transition-all duration-200
                               placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                               hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs mt-1.5 text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
                {password && password.length >= 8 && (
                  <p className="text-xs mt-1.5 text-green-600 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Contraseña segura
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", { 
                      required: "Confirma tu contraseña",
                      validate: value => value === password || "Las contraseñas no coinciden"
                    })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 border-2 border-slate-200
                               focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 
                               outline-none text-slate-800 transition-all duration-200
                               placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                               hover:text-slate-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs mt-1.5 text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("terms", { required: "Debes aceptar los términos" })}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-purple-600 
                             focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <label className="text-sm text-slate-600 cursor-pointer">
                  Acepto los{" "}
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                  >
                    términos y condiciones
                  </button>
                  {" "}y la{" "}
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                  >
                    política de privacidad
                  </button>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500 flex items-center gap-1 -mt-2">
                  <span className="text-xs">⚠️</span>
                  {errors.terms.message}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                           bg-gradient-to-r from-purple-600 to-pink-600 
                           hover:from-purple-700 hover:to-pink-700
                           text-white font-semibold transition-all duration-200
                           shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Crear cuenta</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">
                    ¿Ya tenés cuenta?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-xl border-2 border-slate-200 
                           text-slate-700 font-semibold hover:border-purple-500 
                           hover:bg-purple-50 hover:text-purple-600
                           transition-all duration-200"
              >
                Iniciar sesión
              </button>

            </form>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Registro seguro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Datos encriptados</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}