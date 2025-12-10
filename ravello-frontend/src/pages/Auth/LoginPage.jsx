import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
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
    <div className="bg-white flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex bg-white">

        <div className="w-full md:w-1/2 p-10 flex items-center justify-center relative">
          <div
            className="absolute inset-0 
              bg-black/40 
              backdrop-blur-2xl 
              border-r border-white/10
              shadow-xl 
              rounded-2xl"
          ></div>

          <div className="relative w-full max-w-sm">

            <h1 className="text-3xl font-semibold mb-6 text-white">
              Bienvenido a Ravello
            </h1>

            <p className="text-sm mb-8 text-gray-200">
              Iniciá sesión para continuar
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div>
                <label className="block font-medium mb-1 text-white">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...register("email", { required: "El correo es obligatorio" })}
                  className="w-full px-4 py-2 rounded-lg 
                             bg-white
                             border border-white/20 
                             focus:ring-2 focus:ring-[var(--color-primary-blue)] 
                             outline-none text-black"
                />
                {errors.email && (
                  <p className="text-sm mt-1 text-red-300">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-white">
                  Contraseña
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "La contraseña es obligatoria" })}
                    className="w-full px-4 py-2 rounded-lg 
                               bg-white
                               border border-white/20
                               focus:ring-2 focus:ring-[var(--color-primary-blue)] 
                               outline-none text-black"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-2.5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#ddd" />
                    ) : (
                      <Eye size={20} color="#ddd" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm mt-1 text-red-300">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-lg 
                           text-white font-medium transition cursor-pointer"
                style={{
                  backgroundColor: "var(--color-primary-blue)",
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <LogIn size={18} />
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>

              <p className="text-center mt-2 text-sm text-gray-200">
                ¿Olvidaste tu contraseña?
                <button
                  type="button"
                  onClick={() => navigate("/recuperar")}
                  className="ml-1 font-medium underline"
                  style={{ color: "var(--color-primary-red)" }}
                >
                  Recuperar
                </button>
              </p>

            </form>
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 gradient-mesh-ravello"></div>
        </div>

      </div>
    </div>
  );
}
