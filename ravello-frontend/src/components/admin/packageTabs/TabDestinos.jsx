import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, MapPin, Hotel, Activity, Calendar } from "lucide-react";

const DestinoItem = ({ field, index, register, control, remove }) => {
  const { fields: actividadesFields, append: appendActividad, remove: removeActividad } = useFieldArray({
    control,
    name: `destinos.${index}.actividades`
  });

  return (
    <div className="border border-gray-300 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-white relative">
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 rounded-full p-1"
      >
        <Trash2 size={18} />
      </button>

      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" />
          Destino #{index + 1}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orden <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register(`destinos.${index}.orden`, { required: true, min: 1 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`destinos.${index}.ciudad`, { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Buenos Aires"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            País <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`destinos.${index}.pais`, { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Argentina"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Días <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register(`destinos.${index}.diasEstadia`, { required: true, min: 1 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="3"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          {...register(`destinos.${index}.descripcion`)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
          placeholder="Descripción del destino..."
        />
      </div>

      {/* Hospedaje */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Hotel size={16} className="text-blue-600" />
          Hospedaje
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hotel</label>
            <input
              {...register(`destinos.${index}.hospedaje.nombre`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Hotel Sheraton"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
            <select
              {...register(`destinos.${index}.hospedaje.categoria`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Seleccionar</option>
              <option value="3 estrellas">3 estrellas</option>
              <option value="4 estrellas">4 estrellas</option>
              <option value="5 estrellas">5 estrellas</option>
              <option value="boutique">Boutique</option>
              <option value="resort">Resort</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              {...register(`destinos.${index}.hospedaje.ubicacion`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Centro"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pensión</label>
            <select
              {...register(`destinos.${index}.hospedaje.gastronomia.pension`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="sin comida">Sin comida</option>
              <option value="desayuno">Desayuno</option>
              <option value="media pension">Media pensión</option>
              <option value="pension completa">Pensión completa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actividades */}
      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Activity size={16} className="text-green-600" />
            Actividades
          </h5>
          <button
            type="button"
            onClick={() => appendActividad({ nombre: "", descripcion: "", duracion: "", incluido: true })}
            className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={14} className="inline mr-1" />
            Actividad
          </button>
        </div>
        {actividadesFields.map((actField, actIndex) => (
          <div key={actField.id} className="bg-white rounded p-3 mb-2 relative">
            <button
              type="button"
              onClick={() => removeActividad(actIndex)}
              className="absolute top-2 right-2 text-red-500"
            >
              <Trash2 size={14} />
            </button>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                {...register(`destinos.${index}.actividades.${actIndex}.nombre`)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Nombre"
              />
              <input
                {...register(`destinos.${index}.actividades.${actIndex}.duracion`)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Duración"
              />
            </div>
            <textarea
              {...register(`destinos.${index}.actividades.${actIndex}.descripcion`)}
              rows={2}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
              placeholder="Descripción"
            />
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                {...register(`destinos.${index}.actividades.${actIndex}.incluido`)}
                className="w-3 h-3"
              />
              <span className="text-xs">Incluido</span>
            </label>
          </div>
        ))}
      </div>

      {/* Traslado */}
      <div className="bg-amber-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-amber-600" />
          Traslado de salida
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <select
            {...register(`destinos.${index}.trasladoSalida.tipo`)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Sin traslado</option>
            <option value="vuelo">Vuelo</option>
            <option value="bus">Bus</option>
            <option value="tren">Tren</option>
          </select>
          <input
            {...register(`destinos.${index}.trasladoSalida.compania`)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Compañía"
          />
        </div>
      </div>
    </div>
  );
};

export const TabDestinos = ({ fields, append, remove, register, control }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Itinerario</h3>
        <p className="text-xs text-gray-500">Cada destino incluye hospedaje, actividades y traslado</p>
      </div>
      <button
        type="button"
        onClick={() => append({
          orden: fields.length + 1,
          ciudad: "",
          pais: "",
          diasEstadia: 1,
          descripcion: "",
          hospedaje: { nombre: "", categoria: "", gastronomia: { pension: "sin comida" } },
          actividades: [],
          trasladoSalida: { tipo: "", compania: "" }
        })}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus size={16} /> Agregar Destino
      </button>
    </div>

    {fields.map((field, index) => (
      <DestinoItem 
        key={field.id} 
        field={field} 
        index={index} 
        register={register} 
        control={control}
        remove={remove}
      />
    ))}

    {fields.length === 0 && (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No hay destinos</p>
      </div>
    )}
  </div>
);