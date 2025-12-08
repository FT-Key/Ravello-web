import { Users, Plus, Trash2 } from "lucide-react";

const CoordinadorItem = ({ index, register, remove }) => (
  <div className="border rounded-lg p-4 bg-gray-50 relative">
    <button type="button" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-500">
      <Trash2 size={18} />
    </button>
    <div className="grid grid-cols-2 gap-4">
      <input {...register(`coordinadores.${index}.nombre`)} className="border rounded-lg px-3 py-2" placeholder="Nombre" />
      <input {...register(`coordinadores.${index}.email`)} className="border rounded-lg px-3 py-2" placeholder="Email" />
      <input {...register(`coordinadores.${index}.telefono`)} className="border rounded-lg px-3 py-2" placeholder="Teléfono" />
      <input {...register(`coordinadores.${index}.rol`)} className="border rounded-lg px-3 py-2" placeholder="Rol" />
    </div>
  </div>
);

export const TabCoordinadores = ({ fields, append, remove, register }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Coordinadores</h3>
      <button
        type="button"
        onClick={() => append({ nombre: "", email: "", telefono: "", rol: "asistente" })}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        <Plus size={16} /> Agregar
      </button>
    </div>
    {fields.map((field, index) => (
      <CoordinadorItem key={field.id} index={index} register={register} remove={remove} />
    ))}
  </div>
);