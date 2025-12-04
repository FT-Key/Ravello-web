import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus, Trash2, Calendar, MapPin, Hotel, Activity, Users, DollarSign, Image as ImageIcon } from "lucide-react";

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
      destinos: [],
      traslado: [],
      actividades: [],
      coordinadores: [],
      hospedaje: null,
    }
  });

  const { fields: destinosFields, append: appendDestino, remove: removeDestino } = useFieldArray({
    control,
    name: "destinos"
  });

  const { fields: trasladoFields, append: appendTraslado, remove: removeTraslado } = useFieldArray({
    control,
    name: "traslado"
  });

  const { fields: actividadesFields, append: appendActividad, remove: removeActividad } = useFieldArray({
    control,
    name: "actividades"
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
        ...pkg,
        descripcionCorta: pkg.descripcionCorta || "",
        descripcionDetallada: pkg.descripcionDetallada || "",
        descripcion: pkg.descripcion || "",
        descuentoNinos: pkg.descuentoNinos || 0,
        duracionTotal: pkg.duracionTotal || 0,
        destinos: pkg.destinos || [],
        traslado: pkg.traslado || [],
        actividades: pkg.actividades || [],
        coordinadores: pkg.coordinadores || [],
        hospedaje: pkg.hospedaje || null,
      });
    } else {
      reset({
        nombre: "",
        tipo: "nacional",
        descripcionCorta: "",
        descripcionDetallada: "",
        descripcion: "",
        precioBase: "",
        moneda: "ARS",
        montoSenia: "",
        plazoPagoTotalDias: 7,
        descuentoNinos: 0,
        etiquetas: [],
        activo: true,
        visibleEnWeb: true,
        destinos: [],
        traslado: [],
        actividades: [],
        coordinadores: [],
        hospedaje: null,
      });
    }

    setImagenPrincipalFile(null);
    setImagenesFiles([]);
  }, [pkg, reset]);

  const etiquetas = watch("etiquetas") || [];
  const tieneHospedaje = watch("hospedaje");

  const toggleEtiqueta = (etq) => {
    const nuevas = etiquetas.includes(etq)
      ? etiquetas.filter((x) => x !== etq)
      : [...etiquetas, etq];
    setValue("etiquetas", nuevas);
  };

  const onSubmit = async (data) => {
    try {
      const method = pkg ? "put" : "post";
      const url = pkg ? `/packages/${pkg._id}` : "/packages";

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "imagenPrincipal" || key === "imagenes") return;
        if (["createdAt", "updatedAt", "__v", "_id"].includes(key)) return;

        const value = data[key];

        if (["destinos", "traslado", "hospedaje", "actividades", "coordinadores"].includes(key)) {
          if (value && (Array.isArray(value) ? value.length > 0 : value !== null)) {
            formData.append(key, JSON.stringify(value));
          }
          return;
        }

        if (key === "etiquetas") {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

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
    { id: "basico", label: "Básico", icon: MapPin },
    { id: "destinos", label: "Destinos", icon: MapPin },
    { id: "traslados", label: "Traslados", icon: Calendar },
    { id: "hospedaje", label: "Hospedaje", icon: Hotel },
    { id: "actividades", label: "Actividades", icon: Activity },
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
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap min-h-8 ${activeTab === tab.id
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Paquete <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.nombre ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Ej: Mendoza Aventura 5 días"
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
                    placeholder="Breve descripción..."
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
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                    placeholder="Descripción completa del paquete..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción Adicional
                  </label>
                  <textarea
                    {...register("descripcion")}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                    placeholder="Información adicional..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
                  <div className="flex flex-wrap gap-2">
                    {["oferta", "nuevo", "mas vendido", "recomendado", "exclusivo"].map((etq) => (
                      <button
                        key={etq}
                        type="button"
                        onClick={() => toggleEtiqueta(etq)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${etiquetas.includes(etq)
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
            )}

            {activeTab === "destinos" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Destinos del Paquete</h3>
                  <button
                    type="button"
                    onClick={() => appendDestino({
                      ciudad: "",
                      pais: "",
                      diasEstadia: 1,
                      descripcion: "",
                      actividades: [],
                      hospedaje: null
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} /> Agregar Destino
                  </button>
                </div>

                {destinosFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeDestino(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register(`destinos.${index}.ciudad`, { required: true })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: Mendoza"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                        <input
                          {...register(`destinos.${index}.pais`)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: Argentina"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Días de Estadía</label>
                        <input
                          type="number"
                          {...register(`destinos.${index}.diasEstadia`)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        {...register(`destinos.${index}.descripcion`)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                        placeholder="Descripción del destino..."
                      />
                    </div>
                  </div>
                ))}

                {destinosFields.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No hay destinos agregados. Haz clic en "Agregar Destino".
                  </p>
                )}
              </div>
            )}

            {activeTab === "traslados" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Traslados</h3>
                  <button
                    type="button"
                    onClick={() => appendTraslado({
                      tipo: "vuelo",
                      compania: "",
                      salida: { lugar: "", fecha: "", hora: "" },
                      llegada: { lugar: "", fecha: "", hora: "" },
                      descripcion: ""
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} /> Agregar Traslado
                  </button>
                </div>

                {trasladoFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeTraslado(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register(`traslado.${index}.tipo`)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="vuelo">Vuelo</option>
                          <option value="bus">Bus</option>
                          <option value="tren">Tren</option>
                          <option value="barco">Barco</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compañía</label>
                        <input
                          {...register(`traslado.${index}.compania`)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: Aerolíneas Argentinas"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Salida</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Lugar</label>
                          <input
                            {...register(`traslado.${index}.salida.lugar`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="Buenos Aires"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Fecha</label>
                          <input
                            type="date"
                            {...register(`traslado.${index}.salida.fecha`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Hora</label>
                          <input
                            type="time"
                            {...register(`traslado.${index}.salida.hora`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Llegada</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Lugar</label>
                          <input
                            {...register(`traslado.${index}.llegada.lugar`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="Mendoza"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Fecha</label>
                          <input
                            type="date"
                            {...register(`traslado.${index}.llegada.fecha`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Hora</label>
                          <input
                            type="time"
                            {...register(`traslado.${index}.llegada.hora`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        {...register(`traslado.${index}.descripcion`)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                        placeholder="Detalles del traslado..."
                      />
                    </div>
                  </div>
                ))}

                {trasladoFields.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No hay traslados agregados.</p>
                )}
              </div>
            )}

            {activeTab === "hospedaje" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={tieneHospedaje !== null && tieneHospedaje !== undefined}
                    onChange={(e) => setValue("hospedaje", e.target.checked ? {
                      nombre: "",
                      categoria: "",
                      ubicacion: "",
                      caracteristicas: [],
                      gastronomia: { pension: "sin comida", descripcion: "" }
                    } : null)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    El paquete incluye hospedaje general
                  </label>
                </div>

                {tieneHospedaje && (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Hotel
                        </label>
                        <input
                          {...register("hospedaje.nombre")}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: Hotel Libertador"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                          {...register("hospedaje.categoria")}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="">Seleccionar</option>
                          <option value="1 estrella">1 estrella</option>
                          <option value="2 estrellas">2 estrellas</option>
                          <option value="3 estrellas">3 estrellas</option>
                          <option value="4 estrellas">4 estrellas</option>
                          <option value="5 estrellas">5 estrellas</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                      <input
                        {...register("hospedaje.ubicacion")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Ej: Centro de Mendoza"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pensión</label>
                      <select
                        {...register("hospedaje.gastronomia.pension")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="sin comida">Sin comida</option>
                        <option value="media pension">Media pensión</option>
                        <option value="pension completa">Pensión completa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción Gastronomía
                      </label>
                      <textarea
                        {...register("hospedaje.gastronomia.descripcion")}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                        placeholder="Detalles sobre la comida incluida..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "actividades" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Actividades Generales</h3>
                  <button
                    type="button"
                    onClick={() => appendActividad({
                      nombre: "",
                      descripcion: "",
                      duracion: "",
                      incluido: true
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} /> Agregar Actividad
                  </button>
                </div>

                {actividadesFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeActividad(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          {...register(`actividades.${index}.nombre`)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: City Tour"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                        <input
                          {...register(`actividades.${index}.duracion`)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Ej: 3 horas"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        {...register(`actividades.${index}.descripcion`)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                        placeholder="Descripción de la actividad..."
                      />
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(`actividades.${index}.incluido`)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Incluido en el precio</span>
                      </label>
                    </div>
                  </div>
                ))}

                {actividadesFields.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No hay actividades agregadas.</p>
                )}
              </div>
            )}

            {activeTab === "coordinadores" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Coordinadores</h3>
                  <button
                    type="button"
                    onClick={() => appendCoordinador({ nombre: "", email: "", telefono: "", rol: "asistente" })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} /> Agregar Coordinador
                  </button>
                </div>

                {coordinadoresFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeCoordinador(index)}
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
                ))}

                {coordinadoresFields.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No hay coordinadores agregados.</p>
                )}
              </div>
            )}

            {activeTab === "precios" && (
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
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.precioBase ? "border-red-500" : "border-gray-300"
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
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.montoSenia ? "border-red-500" : "border-gray-300"
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

                {pkg?.duracionTotal !== undefined && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Duración Total:</strong> {pkg.duracionTotal} días (calculado automáticamente según destinos)
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "imagenes" && (
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
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
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