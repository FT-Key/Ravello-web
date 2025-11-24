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

  return (
    <div className="bg-white rounded-lg shadow p-4">

      {/* 📋 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 font-semibold">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 font-semibold">Acciones</th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  Cargando...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row._id}
                  className="bg-white border-b hover:bg-gray-50 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-3">
                      {col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        String(row[col.key] ?? "")
                      )}
                    </td>
                  ))}

                  {(onEdit || onDelete) && (
                    <td className="px-6 py-3 flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 size={16} /> Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌐 Paginación real del backend */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
