import React, { useState } from "react";
import { ImageIcon, Upload, X, Star, Trash2 } from "lucide-react";

export const TabImagenes = ({ 
  pkg, 
  imagenPrincipalFile, 
  setImagenPrincipalFile, 
  imagenesFiles, 
  setImagenesFiles,
  imagenesExistentesAEliminarRef,
  eliminarImagenPrincipalExistenteRef
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [dragActivePrincipal, setDragActivePrincipal] = useState(false);
  
  // Estados locales para la UI
  const [imagenesExistentesAEliminar, setImagenesExistentesAEliminar] = useState([]);
  const [eliminarImagenPrincipalExistente, setEliminarImagenPrincipalExistente] = useState(false);

  // Sincronizar con las refs del padre
  React.useEffect(() => {
    if (imagenesExistentesAEliminarRef) {
      imagenesExistentesAEliminarRef.current = imagenesExistentesAEliminar;
    }
  }, [imagenesExistentesAEliminar, imagenesExistentesAEliminarRef]);

  React.useEffect(() => {
    if (eliminarImagenPrincipalExistenteRef) {
      eliminarImagenPrincipalExistenteRef.current = eliminarImagenPrincipalExistente;
    }
  }, [eliminarImagenPrincipalExistente, eliminarImagenPrincipalExistenteRef]);

  // Drag and Drop handlers para imagen principal
  const handleDragPrincipal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActivePrincipal(true);
    } else if (e.type === "dragleave") {
      setDragActivePrincipal(false);
    }
  };

  const handleDropPrincipal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePrincipal(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImagenPrincipalFile(file);
        // Si había una imagen principal existente y se sube una nueva, marcarla para eliminar
        if (pkg?.imagenPrincipal?.path) {
          setEliminarImagenPrincipalExistente(true);
        }
      }
    }
  };

  // Drag and Drop handlers para imágenes adicionales
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      setImagenesFiles([...imagenesFiles, ...files]);
    }
  };

  // Eliminar imagen nueva (no guardada aún)
  const removeImagenNueva = (index) => {
    setImagenesFiles(imagenesFiles.filter((_, i) => i !== index));
  };

  // Marcar imagen existente para eliminar
  const marcarImagenExistenteParaEliminar = (path) => {
    if (!imagenesExistentesAEliminar.includes(path)) {
      setImagenesExistentesAEliminar([...imagenesExistentesAEliminar, path]);
    }
  };

  // Desmarcar imagen existente
  const desmarcarImagenExistente = (path) => {
    setImagenesExistentesAEliminar(imagenesExistentesAEliminar.filter(p => p !== path));
  };

  // Filtrar imágenes existentes que no están marcadas para eliminar
  const imagenesExistentesVisibles = (pkg?.imagenes || []).filter(
    img => !imagenesExistentesAEliminar.includes(img.path)
  );

  return (
    <div className="space-y-6">
      {/* Imagen Principal */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-yellow-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Imagen Principal</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Esta imagen se mostrará como portada del paquete
        </p>

        <div
          onDragEnter={handleDragPrincipal}
          onDragLeave={handleDragPrincipal}
          onDragOver={handleDragPrincipal}
          onDrop={handleDropPrincipal}
          className={`relative border-2 border-dashed rounded-xl transition-all ${
            dragActivePrincipal
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          {/* Preview de la imagen actual o nueva */}
          {(pkg?.imagenPrincipal?.url && !imagenPrincipalFile && !eliminarImagenPrincipalExistente) || imagenPrincipalFile ? (
            <div className="relative group">
              <img
                src={
                  imagenPrincipalFile
                    ? URL.createObjectURL(imagenPrincipalFile)
                    : pkg.imagenPrincipal.url
                }
                alt="Imagen principal"
                className="w-full h-64 object-cover rounded-xl"
              />
              
              {/* Overlay con información */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Upload className="mx-auto mb-2" size={32} />
                  <p className="text-sm font-medium">
                    {imagenPrincipalFile ? "Nueva imagen seleccionada" : "Click para cambiar"}
                  </p>
                </div>
              </div>

              {/* Indicador de nueva imagen */}
              {imagenPrincipalFile && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  Nueva
                </div>
              )}

              {/* Botón para remover */}
              <button
                type="button"
                onClick={() => {
                  if (imagenPrincipalFile) {
                    // Si es una imagen nueva, solo la quitamos
                    setImagenPrincipalFile(null);
                    setEliminarImagenPrincipalExistente(false);
                  } else {
                    // Si es una imagen existente, la marcamos para eliminar
                    setEliminarImagenPrincipalExistente(true);
                  }
                }}
                className="absolute top-3 left-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            // Estado vacío
            <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="text-blue-600" size={28} />
                </div>
                <p className="text-base font-medium text-gray-700 mb-1">
                  Click para subir o arrastra la imagen aquí
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP hasta 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagenPrincipalFile(e.target.files[0]);
                    if (pkg?.imagenPrincipal?.path) {
                      setEliminarImagenPrincipalExistente(true);
                    }
                  }
                }}
                className="hidden"
              />
            </label>
          )}

          {/* Input oculto para click cuando ya hay imagen */}
          {((pkg?.imagenPrincipal?.url && !imagenPrincipalFile && !eliminarImagenPrincipalExistente) || imagenPrincipalFile) && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImagenPrincipalFile(e.target.files[0]);
                  if (pkg?.imagenPrincipal?.path && !imagenPrincipalFile) {
                    setEliminarImagenPrincipalExistente(true);
                  }
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Imágenes Adicionales */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Galería de Imágenes</h3>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Añade más imágenes para mostrar en la galería del paquete
        </p>

        {/* Drop zone para múltiples imágenes */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-3">
                <ImageIcon className="text-blue-600" size={24} />
              </div>
              <p className="text-base font-medium text-gray-700 mb-1">
                Arrastra imágenes o haz click para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Puedes seleccionar múltiples archivos
              </p>
            </div>
            <input
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const newFiles = Array.from(e.target.files);
                  setImagenesFiles([...imagenesFiles, ...newFiles]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid de previsualizaciones */}
        {(imagenesFiles.length > 0 || imagenesExistentesVisibles.length > 0) && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Imágenes cargadas ({imagenesFiles.length + imagenesExistentesVisibles.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Imágenes existentes del paquete (no marcadas para eliminar) */}
              {imagenesExistentesVisibles.map((img, i) => (
                <div key={`existing-${i}`} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img
                      src={img.url}
                      alt={img.descripcion || `Imagen ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Actual
                  </div>

                  {/* Botón para eliminar */}
                  <button
                    type="button"
                    onClick={() => marcarImagenExistenteParaEliminar(img.path)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Eliminar imagen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Nuevas imágenes seleccionadas */}
              {imagenesFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-green-500">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Nueva imagen ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Badge de nueva */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Nueva
                  </div>

                  {/* Botón para eliminar */}
                  <button
                    type="button"
                    onClick={() => removeImagenNueva(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Eliminar imagen"
                  >
                    <X size={14} />
                  </button>

                  {/* Overlay con nombre del archivo */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Imágenes marcadas para eliminar */}
        {imagenesExistentesAEliminar.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-red-900">
                ⚠️ Imágenes a eliminar ({imagenesExistentesAEliminar.length})
              </h4>
              <button
                type="button"
                onClick={() => setImagenesExistentesAEliminar([])}
                className="text-xs text-red-700 hover:text-red-900 underline"
              >
                Restaurar todas
              </button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {pkg?.imagenes
                ?.filter(img => imagenesExistentesAEliminar.includes(img.path))
                .map((img, i) => (
                  <div key={`deleted-${i}`} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-red-500 opacity-50">
                      <img
                        src={img.url}
                        alt="Para eliminar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => desmarcarImagenExistente(img.path)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Restaurar"
                    >
                      <span className="text-white text-xs font-semibold">Restaurar</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay imágenes */}
        {imagenesFiles.length === 0 && imagenesExistentesVisibles.length === 0 && (
          <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-500">No hay imágenes adicionales</p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Consejos</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• La imagen principal debe ser de alta calidad y representativa del paquete</li>
          <li>• Usa imágenes con buena iluminación y enfoque</li>
          <li>• Se recomienda una resolución mínima de 1200x800px</li>
          <li>• Las imágenes se optimizarán automáticamente al guardar</li>
          <li>• Las imágenes marcadas para eliminar se borrarán permanentemente al guardar</li>
        </ul>
      </div>
    </div>
  );
};