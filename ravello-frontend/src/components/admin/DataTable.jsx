import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import Pagination from "../common/Pagination";

export default function DataTable({
  columns,
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const totalPages = Math.ceil(total / limit);

  // Función para truncar texto largo de forma segura
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    
    const str = String(text);
    if (str.length <= maxLength) return str;
    
    return (
      <span title={str} className="cursor-help">
        {str.substring(0, maxLength)}...
      </span>
    );
  };

  // Función para renderizar el contenido de una celda de forma segura
  const renderCellContent = (col, row) => {
    try {
      const value = row[col.key];
      
      // Si la columna tiene render personalizado
      if (col.render) {
        return col.render(value, row);
      }

      // Manejo de valores nulos o indefinidos
      if (value === null || value === undefined) {
        return <span className="text-gray-400 italic">-</span>;
      }

      // Manejo de booleanos
      if (typeof value === "boolean") {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {value ? "Sí" : "No"}
          </span>
        );
      }

      // Manejo de arrays
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return <span className="text-gray-400 italic">Ninguno</span>;
        }
        const preview = value.slice(0, 2).join(", ");
        return (
          <span title={value.join(", ")} className="cursor-help">
            {preview}
            {value.length > 2 && ` (+${value.length - 2})`}
          </span>
        );
      }

      // Manejo de objetos
      if (typeof value === "object") {
        return <span className="text-gray-400 italic">[Objeto]</span>;
      }

      // Manejo de números
      if (typeof value === "number") {
        return value.toLocaleString();
      }

      // Manejo de strings largos
      const strValue = String(value);
      if (strValue.length > 60) {
        return truncateText(strValue, 60);
      }

      return strValue;
      
    } catch (error) {
      console.error("Error renderizando celda:", error);
      return <span className="text-red-400 italic">Error</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* 📋 Tabla con scroll horizontal en móviles */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="text-xs uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap"
                  style={{ 
                    minWidth: col.minWidth || 'auto',
                    maxWidth: col.maxWidth || 'none'
                  }}
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gradient-to-r from-gray-50 to-gray-100">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    <span className="text-gray-500 font-medium">Cargando datos...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row._id || `row-${rowIndex}`}
                  className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className="px-4 py-3 align-top"
                      style={{ 
                        maxWidth: col.maxWidth || '300px',
                        minWidth: col.minWidth || 'auto'
                      }}
                    >
                      <div className={`${
                        col.truncate !== false 
                          ? "line-clamp-2 break-words" 
                          : "break-words"
                      }`}>
                        {renderCellContent(col, row)}
                      </div>
                    </td>
                  ))}

                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 whitespace-nowrap sticky right-0 bg-white">
                      <div className="flex gap-2 items-center">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-lg transition-colors duration-200 text-xs font-medium"
                            title="Editar registro"
                          >
                            <Edit3 size={14} />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-colors duration-200 text-xs font-medium"
                            title="Eliminar registro"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 font-medium mb-1">No se encontraron resultados</p>
                      <p className="text-gray-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌐 Paginación */}
      {!loading && data.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{((page - 1) * limit) + 1}</span> a{" "}
              <span className="font-semibold">{Math.min(page * limit, total)}</span> de{" "}
              <span className="font-semibold">{total}</span> resultados
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}