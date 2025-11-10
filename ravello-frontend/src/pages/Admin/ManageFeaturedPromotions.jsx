import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig"; // ✅ usa tu cliente axios

export default function ManageFeaturedPromotions() {
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [titulo, setTitulo] = useState("Ofertas imperdibles");
  const [descripcion, setDescripcion] = useState("Aprovechá los mejores precios de temporada");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await clientAxios.get("/packages?limit=100");
        setPackages(data.items || data || []);
      } catch (err) {
        console.error("❌ Error al cargar paquetes:", err);
        setMessage({ type: "error", text: "No se pudieron cargar los paquetes." });
      }
    };

    const fetchCurrent = async () => {
      try {
        const { data } = await clientAxios.get("/featured-promotions");
        if (data) {
          setSelected(data.packages?.map((p) => p._id) || []);
          setTitulo(data.titulo || "Ofertas imperdibles");
          setDescripcion(data.descripcion || "");
        }
      } catch {
        // Ignorar si no hay registro actual
      }
    };

    fetchPackages();
    fetchCurrent();
  }, []);

  const handleSave = async () => {
    if (selected.length !== 2) {
      setMessage({ type: "warning", text: "Debes seleccionar exactamente 2 paquetes destacados." });
      return;
    }

    setLoading(true);
    try {
      const { data } = await clientAxios.post("/featured-promotions", {
        packages: selected,
        titulo,
        descripcion,
      });

      setMessage({ type: "success", text: "Promociones destacadas actualizadas correctamente." });
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      setMessage({ type: "error", text: "Error al guardar las promociones destacadas." });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 2
          ? [...prev, id]
          : prev
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">🧭 Promociones destacadas</h2>
        <p className="text-gray-500 mb-8">
          Seleccioná los <strong>2 paquetes</strong> que quieras destacar en la
          sección de “Ofertas imperdibles”.
        </p>

        {message.text && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-white ${message.type === "success"
                ? "bg-green-600"
                : message.type === "error"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Seleccioná exactamente 2 paquetes:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  onClick={() => toggleSelect(pkg._id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${selected.includes(pkg._id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                    }`}
                >
                  <p className="font-medium">{pkg.nombre}</p>
                  {pkg.descripcionCorta && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {pkg.descripcionCorta}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={loading || selected.length !== 2}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${loading || selected.length !== 2
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {loading ? "Guardando..." : "Guardar promociones destacadas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
