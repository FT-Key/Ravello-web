import React, { useState, useMemo } from "react";
import { Edit3, Trash2, Search } from "lucide-react";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔍 Filtrado por búsqueda
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((pkg) =>
      Object.values(pkg).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  // 📄 Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* 🔍 Barra de búsqueda */}
      <div className="flex justify-between mb-4 items-center">
        <div className="relative w-64">
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar paquete..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

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
              <th className="px-6 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row._id}
                  className="bg-white border-b hover:bg-gray-50 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-3">
                      {col.key === "visibleEnWeb" ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${row.visibleEnWeb
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {row.visibleEnWeb ? "Visible" : "Oculto"}
                        </span>
                      ) : col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}

                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => onEdit(row)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 size={16} /> Editar
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="px-2 py-1 text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
