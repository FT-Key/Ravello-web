import React from "react";

export default function PackageGallery({ pkg, selectedImage, setSelectedImage }) {
  const renderEtiqueta = (etiqueta) => {
    const styles = {
      oferta: "bg-red-500 text-white",
      nuevo: "bg-green-500 text-white",
      "mas vendido": "bg-blue-500 text-white",
      recomendado: "bg-purple-500 text-white",
      exclusivo: "bg-yellow-500 text-dark",
      "ultimo momento": "bg-orange-500 text-white",
    };

    return (
      <span
        key={etiqueta}
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase no-select ${
          styles[etiqueta] || "bg-gray-500 text-white"
        }`}
      >
        {etiqueta}
      </span>
    );
  };

  const allImages = [
    pkg.imagenPrincipal,
    ...(pkg.imagenes || []).filter(
      (img) => img.url !== pkg.imagenPrincipal?.url
    ),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 no-select">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 no-select">

        {/* Imagen principal */}
        <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden no-select">
          <img
            src={allImages[selectedImage]?.url || "/placeholder-package.jpg"}
            alt={pkg.nombre}
            className="w-full h-full object-cover"
          />

          {pkg.etiquetas && pkg.etiquetas.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 no-select">
              {pkg.etiquetas.map(renderEtiqueta)}
            </div>
          )}

          {pkg.categoria && (
            <div className="absolute bottom-4 right-4 no-select">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-dark capitalize no-select">
                {pkg.categoria}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-2 gap-4">
          {allImages.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative h-36 lg:h-60 rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedImage === idx
                  ? "ring-4 ring-primary-blue"
                  : "hover:opacity-80"
              }`}
            >
              <img
                src={img.url}
                alt={img.descripcion || `${pkg.nombre} ${idx + 1}`}
                className="w-full h-full object-cover no-select"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
