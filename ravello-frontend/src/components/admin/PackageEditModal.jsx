import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Tag, MapPin, Info, Users, DollarSign, Image as ImageIcon } from "lucide-react";
import clientAxios from "../../api/axiosConfig"; // Ajusta la ruta según tu estructura

// Importar todos los tabs
import {
  TabBasico,
  TabDestinos,
  TabIncluye,
  TabCoordinadores,
  TabPrecios,
  TabImagenes
} from "./PackageTabs";

export default function PackageEditModal({ open, onClose, pkg, onSaved }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setActiveTab("basico"); // Resetear a la primera tab
  }, [pkg, reset]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Campos a excluir
      const excludeFields = [
        "imagenPrincipal",
        "imagenes",
        "createdAt",
        "updatedAt",
        "__v",
        "_id",
        "slug",
        "duracionTotal"
      ];

      // Agregar campos al FormData
      Object.keys(data).forEach((key) => {
        if (excludeFields.includes(key)) return;

        const value = data[key];

        // Arrays y objetos complejos como JSON
        if (["destinos", "coordinadores", "incluyeGeneral", "noIncluyeGeneral", "etiquetas"].includes(key)) {
          // CORRECCIÓN: Asegurar que siempre sea un array válido
          let arrayValue = [];

          if (Array.isArray(value)) {
            arrayValue = value;
          } else if (value === null || value === undefined || value === "") {
            arrayValue = [];
          }

          formData.append(key, JSON.stringify(arrayValue));
          return;
        }

        // Valores numéricos
        if (["precioBase", "montoSenia", "capacidadMinima", "capacidadMaxima", "descuentoNinos", "plazoPagoTotalDias"].includes(key)) {
          const numValue = Number(value);
          if (!isNaN(numValue) && value !== "" && value !== null) {
            formData.append(key, numValue);
          }
          return;
        }

        // Booleanos
        if (typeof value === "boolean") {
          formData.append(key, value);
          return;
        }

        // Valores simples
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // IMPORTANTE: Asegurar que incluyeGeneral y noIncluyeGeneral existan
      if (!formData.has("incluyeGeneral")) {
        formData.append("incluyeGeneral", JSON.stringify([]));
      }
      if (!formData.has("noIncluyeGeneral")) {
        formData.append("noIncluyeGeneral", JSON.stringify([]));
      }
      if (!formData.has("etiquetas")) {
        formData.append("etiquetas", JSON.stringify([]));
      }
      if (!formData.has("destinos")) {
        formData.append("destinos", JSON.stringify([]));
      }
      if (!formData.has("coordinadores")) {
        formData.append("coordinadores", JSON.stringify([]));
      }
      console.log("FormData: ", formData)

      // Validar campos requeridos
      if (!data.precioBase || Number(data.precioBase) <= 0) {
        alert("El precio base es obligatorio y debe ser mayor a 0");
        setIsSubmitting(false);
        return;
      }

      if (!data.montoSenia || Number(data.montoSenia) <= 0) {
        alert("El monto de seña es obligatorio y debe ser mayor a 0");
        setIsSubmitting(false);
        return;
      }

      // Agregar imágenes
      if (imagenPrincipalFile) {
        formData.append("imagenPrincipal", imagenPrincipalFile);
      }

      imagenesFiles.forEach((file) => {
        formData.append("imagenes", file);
      });

      // Debug
      console.log("📤 Enviando FormData:");
      for (let pair of formData.entries()) {
        console.log("📦", pair[0], ":", pair[1]);
      }

      // Llamada a la API
      const url = pkg ? `/packages/${pkg._id}` : "/packages";
      const method = pkg ? "put" : "post";

      const response = await clientAxios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Paquete guardado:", response.data);

      if (onSaved) {
        onSaved(response.data.data || response.data);
      }

      onClose();
      alert(`Paquete ${pkg ? "actualizado" : "creado"} correctamente`);

    } catch (err) {
      console.error("❌ Error al guardar el paquete:", err);

      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || "Error al guardar el paquete";

        if (err.response.status === 400) {
          console.error("Errores de validación:", err.response.data.errors);

          const errors = err.response.data.errors || [errorMessage];
          const errorList = Array.isArray(errors) ? errors.join('\n') : errors;
          alert(`Errores de validación:\n\n${errorList}`);
        } else if (err.response.status === 404) {
          alert("Paquete no encontrado");
        } else if (err.response.status === 500) {
          alert("Error del servidor. Por favor, intente nuevamente.");
        } else {
          alert(errorMessage);
        }
      } else if (err.request) {
        alert("No se pudo conectar con el servidor. Verifique su conexión.");
      } else {
        alert("Error inesperado. Por favor, intente nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl overflow-hidden flex flex-col my-8 min-h-[600px] max-h-[calc(100vh-4rem)]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {pkg ? "Editar paquete" : "Nuevo paquete"}
            </h2>
            {pkg && <p className="text-sm text-gray-500 mt-1">ID: {pkg._id}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50 overflow-x-auto flex-shrink-0">
          <div className="flex px-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                disabled={isSubmitting}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
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
              />
            )}

            {activeTab === "incluye" && (
              <TabIncluye
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
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                pkg ? "Guardar Cambios" : "Crear Paquete"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}