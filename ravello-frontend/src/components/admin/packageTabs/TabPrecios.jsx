import React from "react";

export const TabPrecios = ({ register, errors, watch }) => {
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
              min: { value: 0, message: "Debe ser mayor o igual a 0" }
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
              min: { value: 0.01, message: "Debe ser mayor a 0" }
            })}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
              errors.montoSenia ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.montoSenia && (
            <p className="text-red-500 text-sm mt-1">{errors.montoSenia.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Monto que el cliente debe pagar como seña inicial
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plazo Pago Total (días)
          </label>
          <input
            type="number"
            {...register("plazoPagoTotalDias", {
              min: { value: 1, message: "Debe ser al menos 1 día" }
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="7"
          />
          {errors.plazoPagoTotalDias && (
            <p className="text-red-500 text-sm mt-1">{errors.plazoPagoTotalDias.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Días que tiene el cliente para pagar el total después de la seña
          </p>
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