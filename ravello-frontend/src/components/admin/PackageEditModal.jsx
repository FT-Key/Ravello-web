import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus, Trash2, Calendar, MapPin, Hotel, Activity, Users, DollarSign, Image as ImageIcon, Info, Tag } from "lucide-react";

// ============================================================
// COMPONENTES DE TABS
// ============================================================

const TabBasico = ({ register, errors, watch, setValue }) => {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag size={16} className="inline mr-1" />
          Etiquetas
        </label>
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

// ============================================================

const DestinoItem = ({ field, index, register, control, remove, errors }) => {
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

      {/* Información básica del destino */}
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
            placeholder="Ej: Buenos Aires"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            País <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`destinos.${index}.pais`, { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Ej: Argentina"
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

      {/* Hospedaje del destino */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Hotel size={16} className="text-blue-600" />
          Hospedaje en este destino
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Hotel</label>
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
              <option value="1 estrella">1 estrella</option>
              <option value="2 estrellas">2 estrellas</option>
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
              placeholder="Centro, Puerto Madero..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Pensión</label>
            <select
              {...register(`destinos.${index}.hospedaje.gastronomia.pension`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="sin comida">Sin comida</option>
              <option value="desayuno">Desayuno</option>
              <option value="media pension">Media pensión</option>
              <option value="pension completa">Pensión completa</option>
              <option value="todo incluido">Todo incluido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actividades del destino */}
      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Activity size={16} className="text-green-600" />
            Actividades en este destino
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
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={14} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                <input
                  {...register(`destinos.${index}.actividades.${actIndex}.nombre`)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="City Tour"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Duración</label>
                <input
                  {...register(`destinos.${index}.actividades.${actIndex}.duracion`)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="3 horas"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Precio Adicional</label>
                <input
                  type="number"
                  {...register(`destinos.${index}.actividades.${actIndex}.precio`)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Descripción</label>
              <textarea
                {...register(`destinos.${index}.actividades.${actIndex}.descripcion`)}
                rows={2}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
                placeholder="Detalles de la actividad..."
              />
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                {...register(`destinos.${index}.actividades.${actIndex}.incluido`)}
                className="w-3 h-3 text-green-600 rounded"
              />
              <span className="text-xs text-gray-700">Incluido en el precio</span>
            </label>
          </div>
        ))}
        {actividadesFields.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-2">Sin actividades</p>
        )}
      </div>

      {/* Traslado de salida */}
      <div className="bg-amber-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-amber-600" />
          Traslado de salida desde este destino
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
            <select
              {...register(`destinos.${index}.trasladoSalida.tipo`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Sin traslado</option>
              <option value="vuelo">Vuelo</option>
              <option value="bus">Bus</option>
              <option value="tren">Tren</option>
              <option value="barco">Barco</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Compañía</label>
            <input
              {...register(`destinos.${index}.trasladoSalida.compania`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Aerolíneas Argentinas"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Salida</p>
            <input
              {...register(`destinos.${index}.trasladoSalida.salida.lugar`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
              placeholder="Lugar (ej: AEP)"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                {...register(`destinos.${index}.trasladoSalida.salida.fecha`)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="time"
                {...register(`destinos.${index}.trasladoSalida.salida.hora`)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Llegada</p>
            <input
              {...register(`destinos.${index}.trasladoSalida.llegada.lugar`)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
              placeholder="Lugar (ej: MDZ)"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                {...register(`destinos.${index}.trasladoSalida.llegada.fecha`)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="time"
                {...register(`destinos.${index}.trasladoSalida.llegada.hora`)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabDestinos = ({ fields, append, remove, register, control, errors }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Itinerario de Destinos</h3>
        <p className="text-xs text-gray-500 mt-1">Cada destino incluye hospedaje, actividades y traslado de salida</p>
      </div>
      <button
        type="button"
        onClick={() => append({
          orden: fields.length + 1,
          ciudad: "",
          pais: "",
          diasEstadia: 1,
          descripcion: "",
          hospedaje: {
            nombre: "",
            categoria: "",
            ubicacion: "",
            gastronomia: { pension: "sin comida", descripcion: "" }
          },
          actividades: [],
          trasladoSalida: {
            tipo: "",
            compania: "",
            salida: { lugar: "", fecha: "", hora: "" },
            llegada: { lugar: "", fecha: "", hora: "" }
          }
        })}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
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
        errors={errors}
      />
    ))}

    {fields.length === 0 && (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 mb-2">No hay destinos en el itinerario</p>
        <p className="text-xs text-gray-400">Haz clic en "Agregar Destino" para comenzar</p>
      </div>
    )}
  </div>
);

// ============================================================

const TabIncluye = ({ register, watch, setValue }) => {
  const [nuevoIncluye, setNuevoIncluye] = useState("");
  const [nuevoNoIncluye, setNuevoNoIncluye] = useState("");

  const incluyeGeneral = watch("incluyeGeneral") || [];
  const noIncluyeGeneral = watch("noIncluyeGeneral") || [];

  const agregarIncluye = () => {
    if (nuevoIncluye.trim()) {
      setValue("incluyeGeneral", [...incluyeGeneral, nuevoIncluye.trim()]);
      setNuevoIncluye("");
    }
  };

  const eliminarIncluye = (index) => {
    setValue("incluyeGeneral", incluyeGeneral.filter((_, i) => i !== index));
  };

  const agregarNoIncluye = () => {
    if (nuevoNoIncluye.trim()) {
      setValue("noIncluyeGeneral", [...noIncluyeGeneral, nuevoNoIncluye.trim()]);
      setNuevoNoIncluye("");
    }
  };

  const eliminarNoIncluye = (index) => {
    setValue("noIncluyeGeneral", noIncluyeGeneral.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Info size={20} className="text-green-600" />
          ¿Qué incluye el paquete?
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            value={nuevoIncluye}
            onChange={(e) => setNuevoIncluye(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarIncluye())}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Ej: Seguro de viaje, Asistencia 24/7..."
          />
          <button
            type="button"
            onClick={agregarIncluye}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {incluyeGeneral.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
              <span className="text-green-600">✓</span>
              <span className="flex-1 text-sm text-gray-700">{item}</span>
              <button
                type="button"
                onClick={() => eliminarIncluye(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {incluyeGeneral.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No hay items agregados</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Info size={20} className="text-red-600" />
          ¿Qué NO incluye el paquete?
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            value={nuevoNoIncluye}
            onChange={(e) => setNuevoNoIncluye(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarNoIncluye())}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Ej: Vuelos internos, Propinas..."
          />
          <button
            type="button"
            onClick={agregarNoIncluye}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {noIncluyeGeneral.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
              <span className="text-red-600">✗</span>
              <span className="flex-1 text-sm text-gray-700">{item}</span>
              <button
                type="button"
                onClick={() => eliminarNoIncluye(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {noIncluyeGeneral.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No hay items agregados</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================

const CoordinadorItem = ({ field, index, register, remove }) => (
  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
    <button
      type="button"
      onClick={() => remove(index)}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
    >
      <Trash2 size={18} />
    </button>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          {...register(`coordinadores.${index}.nombre`)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Nombre del coordinador"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          {...register(`coordinadores.${index}.email`)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="email@ejemplo.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input
          {...register(`coordinadores.${index}.telefono`)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="+54 9 11 1234-5678"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <input
          {...register(`coordinadores.${index}.rol`)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Ej: asistente, guía"
        />
      </div>
    </div>
  </div>
);

const TabCoordinadores = ({ fields, append, remove, register }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Coordinadores del Paquete</h3>
      <button
        type="button"
        onClick={() => append({ nombre: "", email: "", telefono: "", rol: "asistente" })}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <Plus size={16} /> Agregar Coordinador
      </button>
    </div>

    {fields.map((field, index) => (
      <CoordinadorItem key={field.id} field={field} index={index} register={register} remove={remove} />
    ))}

    {fields.length === 0 && (
      <p className="text-gray-500 text-center py-8">No hay coordinadores agregados.</p>
    )}
  </div>
);

// ============================================================

const TabPrecios = ({ register, errors, watch }) => {
  const duracionTotal = watch("duracionTotal") || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
        Precios y Condiciones de Pago
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Base <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("precioBase", {
              required: "El precio base es obligatorio",
              min: { value: 0, message: "El precio no puede ser negativo" }
            })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
              errors.precioBase ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.precioBase && (
            <p className="text-red-500 text-sm mt-1">{errors.precioBase.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
          <select
            {...register("moneda")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ARS">ARS - Peso Argentino</option>
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descuento Niños (%)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("descuentoNinos", {
              min: { value: 0, message: "No puede ser negativo" },
              max: { value: 100, message: "No puede ser mayor a 100" }
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="0"
          />
          {errors.descuentoNinos && (
            <p className="text-red-500 text-sm mt-1">{errors.descuentoNinos.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto de Seña <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("montoSenia", {
              required: "El monto de seña es obligatorio",
              min: { value: 0, message: "No puede ser negativo" }
            })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
              errors.montoSenia ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.montoSenia && (
            <p className="text-red-500 text-sm mt-1">{errors.montoSenia.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plazo Pago Total (días)
          </label>
          <input
            type="number"
            {...register("plazoPagoTotalDias")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="7"
          />
        </div>
      </div>

      {duracionTotal > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Duración Total:</strong> {duracionTotal} días (calculado automáticamente según destinos)
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================

const TabImagenes = ({ pkg, imagenPrincipalFile, setImagenPrincipalFile, imagenesFiles, setImagenesFiles }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
      Imágenes
    </h3>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Imagen Principal <span className="text-red-500">*</span>
      </label>

      {pkg?.imagenPrincipal?.url && !imagenPrincipalFile && (
        <div className="mb-2">
          <img
            src={pkg.imagenPrincipal.url}
            alt="Imagen principal actual"
            className="w-48 h-32 object-cover rounded-lg border border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">Imagen actual</p>
        </div>
      )}

      {imagenPrincipalFile && (
        <div className="mb-2">
          <img
            src={URL.createObjectURL(imagenPrincipalFile)}
            alt="Nueva imagen principal"
            className="w-48 h-32 object-cover rounded-lg border border-green-500"
          />
          <p className="text-xs text-green-600 mt-1">Nueva imagen seleccionada</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagenPrincipalFile(e.target.files[0])}
        className="w-full border border-gray-300 rounded-lg px-3 py-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Imágenes Adicionales
      </label>

      {pkg?.imagenes?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Imágenes actuales:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {pkg.imagenes.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Imagen ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-300"
              />
            ))}
          </div>
        </div>
      )}

      {imagenesFiles.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-green-600 mb-2">Nuevas imágenes seleccionadas:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {imagenesFiles.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`Nueva imagen ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-green-500"
              />
            ))}
          </div>
        </div>
      )}

      <input
        multiple
        type="file"
        accept="image/*"
        onChange={(e) => setImagenesFiles(Array.from(e.target.files))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2"
      />
    </div>
  </div>
);

// ============================================================
// COMPONENTE PRINCIPAL - MODAL
// ============================================================

export default function PackageModal({ open, onClose, pkg, onSaved }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      tipo: "nacional",
      categoria: "",
      descripcionCorta: "",
      descripcionDetallada: "",
      precioBase: "",
      moneda: "ARS",
      montoSenia: "",
      plazoPagoTotalDias: 7,
      descuentoNinos: 0,
      capacidadMinima: 1,
      capacidadMaxima: "",
      etiquetas: [],
      activo: true,
      visibleEnWeb: true,
      destinos: [],
      coordinadores: [],
      incluyeGeneral: [],
      noIncluyeGeneral: [],
    }
  });

  const { fields: destinosFields, append: appendDestino, remove: removeDestino } = useFieldArray({
    control,
    name: "destinos"
  });

  const { fields: coordinadoresFields, append: appendCoordinador, remove: removeCoordinador } = useFieldArray({
    control,
    name: "coordinadores"
  });

  const [imagenPrincipalFile, setImagenPrincipalFile] = useState(null);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("basico");

  useEffect(() => {
    if (pkg) {
      reset({
        nombre: pkg.nombre || "",
        slug: pkg.slug || "",
        tipo: pkg.tipo || "nacional",
        categoria: pkg.categoria || "",
        descripcionCorta: pkg.descripcionCorta || "",
        descripcionDetallada: pkg.descripcionDetallada || "",
        precioBase: pkg.precioBase || "",
        moneda: pkg.moneda || "ARS",
        montoSenia: pkg.montoSenia || "",
        plazoPagoTotalDias: pkg.plazoPagoTotalDias || 7,
        descuentoNinos: pkg.descuentoNinos || 0,
        capacidadMinima: pkg.capacidadMinima || 1,
        capacidadMaxima: pkg.capacidadMaxima || "",
        etiquetas: pkg.etiquetas || [],
        activo: pkg.activo !== undefined ? pkg.activo : true,
        visibleEnWeb: pkg.visibleEnWeb !== undefined ? pkg.visibleEnWeb : true,
        destinos: pkg.destinos || [],
        coordinadores: pkg.coordinadores || [],
        incluyeGeneral: pkg.incluyeGeneral || [],
        noIncluyeGeneral: pkg.noIncluyeGeneral || [],
        duracionTotal: pkg.duracionTotal || 0,
      });
    } else {
      reset({
        nombre: "",
        tipo: "nacional",
        categoria: "",
        descripcionCorta: "",
        descripcionDetallada: "",
        precioBase: "",
        moneda: "ARS",
        montoSenia: "",
        plazoPagoTotalDias: 7,
        descuentoNinos: 0,
        capacidadMinima: 1,
        capacidadMaxima: "",
        etiquetas: [],
        activo: true,
        visibleEnWeb: true,
        destinos: [],
        coordinadores: [],
        incluyeGeneral: [],
        noIncluyeGeneral: [],
      });
    }

    setImagenPrincipalFile(null);
    setImagenesFiles([]);
  }, [pkg, reset]);

  const onSubmit = async (data) => {
    try {
      const method = pkg ? "put" : "post";
      const url = pkg ? `/packages/${pkg._id}` : "/packages";

      const formData = new FormData();

      // Campos a excluir
      const excludeFields = ["imagenPrincipal", "imagenes", "createdAt", "updatedAt", "__v", "_id", "slug", "duracionTotal"];

      Object.keys(data).forEach((key) => {
        if (excludeFields.includes(key)) return;

        const value = data[key];

        // Arrays y objetos complejos se envían como JSON
        if (["destinos", "coordinadores", "incluyeGeneral", "noIncluyeGeneral", "etiquetas", "fechasDisponibles"].includes(key)) {
          if (value && (Array.isArray(value) ? value.length > 0 : value !== null)) {
            formData.append(key, JSON.stringify(value));
          }
          return;
        }

        // Valores simples
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Imágenes
      if (imagenPrincipalFile) {
        formData.append("imagenPrincipal", imagenPrincipalFile);
      }

      imagenesFiles.forEach((file) => formData.append("imagenes", file));

      console.log("📤 Enviando FormData:");
      for (let pair of formData.entries()) {
        console.log("📦", pair[0], ":", pair[1]);
      }

      // Aquí va tu llamada a clientAxios
      // const { data: saved } = await clientAxios({ method, url, data: formData, headers: { "Content-Type": "multipart/form-data" } });

      setTimeout(() => {
        alert(`Paquete ${pkg ? "actualizado" : "creado"} correctamente`);
        onSaved({ ...data, _id: pkg?._id || "new-id" });
        onClose();
      }, 500);

    } catch (err) {
      console.error(err);
      alert("Error al guardar el paquete");
    }
  };

  if (!open) return null;

  const tabs = [
    { id: "basico", label: "Básico", icon: Tag },
    { id: "destinos", label: "Itinerario", icon: MapPin },
    { id: "incluye", label: "Incluye/No Incluye", icon: Info },
    { id: "coordinadores", label: "Coordinadores", icon: Users },
    { id: "precios", label: "Precios", icon: DollarSign },
    { id: "imagenes", label: "Imágenes", icon: ImageIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {pkg ? "Editar paquete" : "Nuevo paquete"}
            </h2>
            {pkg && <p className="text-sm text-gray-500 mt-1">ID: {pkg._id}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b bg-gray-50 overflow-x-auto min-h-16">
          <div className="flex px-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap min-h-8 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {activeTab === "basico" && (
              <TabBasico
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {activeTab === "destinos" && (
              <TabDestinos
                fields={destinosFields}
                append={appendDestino}
                remove={removeDestino}
                register={register}
                control={control}
                errors={errors}
              />
            )}

            {activeTab === "incluye" && (
              <TabIncluye
                register={register}
                watch={watch}
                setValue={setValue}
              />
            )}

            {activeTab === "coordinadores" && (
              <TabCoordinadores
                fields={coordinadoresFields}
                append={appendCoordinador}
                remove={removeCoordinador}
                register={register}
              />
            )}

            {activeTab === "precios" && (
              <TabPrecios
                register={register}
                errors={errors}
                watch={watch}
              />
            )}

            {activeTab === "imagenes" && (
              <TabImagenes
                pkg={pkg}
                imagenPrincipalFile={imagenPrincipalFile}
                setImagenPrincipalFile={setImagenPrincipalFile}
                imagenesFiles={imagenesFiles}
                setImagenesFiles={setImagenesFiles}
              />
            )}

            <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                {pkg ? "Guardar Cambios" : "Crear Paquete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}