import React from "react";

export const TabBasico = ({ register, errors, watch, setValue }) => {
  const etiquetas = watch("etiquetas") || [];

  const toggleEtiqueta = (etq) => {
    const nuevas = etiquetas.includes(etq)
      ? etiquetas.filter((x) => x !== etq)
      : [...etiquetas, etq];
    setValue("etiquetas", nuevas);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Paquete <span className="text-red-500">*</span>
          </label>
          <input
            {...register("nombre", { required: "El nombre es obligatorio" })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Buenos Aires + Mendoza 7 días"
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select {...register("tipo")} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="nacional">Nacional</option>
            <option value="internacional">Internacional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select {...register("categoria")} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="">Seleccionar</option>
            <option value="aventura">Aventura</option>
            <option value="relax">Relax</option>
            <option value="cultural">Cultural</option>
            <option value="gastronomico">Gastronómico</option>
            <option value="familiar">Familiar</option>
            <option value="romantico">Romántico</option>
            <option value="ejecutivo">Ejecutivo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción Corta (máx. 200 caracteres)
        </label>
        <textarea
          {...register("descripcionCorta", {
            maxLength: { value: 200, message: "Máximo 200 caracteres" }
          })}
          rows={2}
          maxLength={200}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
          placeholder="Breve descripción atractiva del paquete..."
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{errors.descripcionCorta?.message || ""}</span>
          <span>{watch("descripcionCorta")?.length || 0}/200</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción Detallada
        </label>
        <textarea
          {...register("descripcionDetallada")}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
          placeholder="Descripción completa del paquete, itinerario general, experiencias destacadas..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Mínima</label>
          <input
            type="number"
            {...register("capacidadMinima", { min: 1 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
          <input
            type="number"
            {...register("capacidadMaxima", { min: 1 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
        <div className="flex flex-wrap gap-2">
          {["oferta", "nuevo", "mas vendido", "recomendado", "exclusivo", "ultimo momento"].map((etq) => (
            <button
              key={etq}
              type="button"
              onClick={() => toggleEtiqueta(etq)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                etiquetas.includes(etq)
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {etq}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("activo")} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm font-medium text-gray-700">Activo</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("visibleEnWeb")} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm font-medium text-gray-700">Visible en Web</span>
        </label>
      </div>
    </div>
  );
};