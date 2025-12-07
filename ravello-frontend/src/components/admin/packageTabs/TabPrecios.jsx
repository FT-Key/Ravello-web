import { DollarSign } from "lucide-react";

export const TabPrecios = ({ register, errors, watch }) => {
  const duracionTotal = watch("duracionTotal") || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Precios</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio Base *</label>
          <input
            type="number"
            step="0.01"
            {...register("precioBase", { required: "Requerido", min: 0 })}
            className={`w-full border rounded-lg px-3 py-2 ${errors.precioBase ? "border-red-500" : ""}`}
          />
          {errors.precioBase && <p className="text-red-500 text-sm">{errors.precioBase.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Moneda</label>
          <select {...register("moneda")} className="w-full border rounded-lg px-3 py-2">
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descuento Niños (%)</label>
          <input type="number" {...register("descuentoNinos")} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>
      {duracionTotal > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm"><strong>Duración:</strong> {duracionTotal} días</p>
        </div>
      )}
    </div>
  );
};