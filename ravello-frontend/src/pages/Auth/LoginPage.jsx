import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, LogIn, Plane, MapPin, Compass } from "lucide-react";
import clientAxios from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await clientAxios.post("/auth/login", data);

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        toast.error("Error inesperado: respuesta incompleta");
        return;
      }

      setUser(user);
      setToken(token);

      toast.success("Ingreso correcto");

      navigate("/admin");

    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Credenciales incorrectas"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Decorative animated elements */}
      <div className="absolute top-20 left-10 opacity-10 animate-float">
        <Plane size={120} className="text-blue-600 rotate-45" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 animate-float-delayed">
        <Compass size={100} className="text-indigo-600" />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-5 animate-pulse">
        <MapPin size={80} className="text-blue-500" />
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Left side - Login Form */}
          <div className="relative p-8 md:p-12 flex flex-col justify-center bg-white z-10">

            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Plane size={20} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Ravello
                </h1>
              </div>
              <p className="text-slate-600 text-sm">Tu próxima aventura comienza aquí</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Bienvenido de nuevo
              </h2>
              <p className="text-slate-500 text-sm">
                Ingresá a tu cuenta para gestionar tus viajes
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email", { required: "El correo es obligatorio" })}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 
                               focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 
                               outline-none text-slate-800 transition-all duration-200
                               placeholder:text-slate-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm mt-1.5 text-red-500 flex items-center gap-1">
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
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: "La contraseña es obligatoria" })}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200
                               focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 
                               outline-none text-slate-800 transition-all duration-200
                               placeholder:text-slate-400 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                               hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm mt-1.5 text-red-500 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 
                               focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-slate-600 group-hover:text-slate-800">
                    Recordarme
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/recuperar")}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                           bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700
                           text-white font-semibold transition-all duration-200
                           shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ingresando...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Iniciar sesión</span>
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
                    ¿Primera vez en Ravello?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <button
                type="button"
                onClick={() => navigate("/registro")}
                className="w-full py-3.5 rounded-xl border-2 border-slate-200 
                           text-slate-700 font-semibold hover:border-blue-500 
                           hover:bg-blue-50 hover:text-blue-600
                           transition-all duration-200"
              >
                Crear una cuenta
              </button>

            </form>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Conexión segura</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Datos protegidos</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right side - Visual/Branding */}
          <div className="hidden md:block relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 overflow-hidden">

            {/* Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-center p-12 text-white">

              {/* Main illustration */}
              <div className="mb-8 relative">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center
                                shadow-2xl border border-white/20">
                  <Plane size={64} className="text-white animate-float" />
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full animate-bounce"></div>
              </div>

              <h3 className="text-3xl font-bold mb-4 text-center">
                Explorá el mundo
              </h3>
              <p className="text-blue-100 text-center mb-8 max-w-md leading-relaxed">
                Gestioná tus paquetes turísticos, reservas y experiencias desde un solo lugar
              </p>

              {/* Feature list */}
              <div className="space-y-4 w-full max-w-sm">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <p className="font-semibold">Viajes personalizados</p>
                    <p className="text-xs text-blue-100">Experiencias únicas a tu medida</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌎</span>
                  </div>
                  <div>
                    <p className="font-semibold">Destinos increíbles</p>
                    <p className="text-xs text-blue-100">Más de 100 destinos disponibles</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <p className="font-semibold">Gestión fácil</p>
                    <p className="text-xs text-blue-100">Todo en un solo panel</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating shapes decoration */}
            <div className="absolute bottom-10 right-10 w-20 h-20 border-4 border-white/30 rounded-full animate-spin-slow"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl rotate-12 animate-float"></div>

          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}