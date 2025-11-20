import React, { useEffect, useState } from "react";

const TAG_COLORS = {
  nuevo: "bg-green-500",
  oferta: "bg-red-500",
  "mas vendido": "bg-yellow-500",
  recomendado: "bg-blue-500",
  exclusivo: "bg-purple-500",
};

const PackageTags = ({ etiquetas = [], interval = 3000 }) => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (etiquetas.length <= 1) return;

    const timer = setInterval(() => {
      // Animación fade out
      setFade(false);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % etiquetas.length);
        setFade(true); // fade in
      }, 300); // duración del fade
    }, interval);

    return () => clearInterval(timer);
  }, [etiquetas, interval]);

  if (!etiquetas.length) return null;

  return (
    <div className="absolute top-4 right-4">
      <div
        className={`px-3 py-1 rounded-full text-white text-sm font-semibold transition-all duration-300 transform ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          } ${TAG_COLORS[etiquetas[current]] || "bg-gray-500"}`}
      >
        {etiquetas[current].toUpperCase()}
      </div>
    </div>
  );
};

export default PackageTags;
