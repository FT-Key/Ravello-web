import { ImageIcon } from "lucide-react";

export const TabImagenes = ({ pkg, imagenPrincipalFile, setImagenPrincipalFile, imagenesFiles, setImagenesFiles }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Imágenes</h3>
    <div>
      <label className="block text-sm font-medium mb-1">Imagen Principal *</label>
      {pkg?.imagenPrincipal?.url && !imagenPrincipalFile && (
        <img src={pkg.imagenPrincipal.url} className="w-48 h-32 object-cover rounded-lg mb-2" />
      )}
      {imagenPrincipalFile && (
        <img src={URL.createObjectURL(imagenPrincipalFile)} className="w-48 h-32 object-cover rounded-lg mb-2 border-2 border-green-500" />
      )}
      <input type="file" accept="image/*" onChange={(e) => setImagenPrincipalFile(e.target.files[0])} className="w-full border rounded-lg px-3 py-2" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Imágenes Adicionales</label>
      {imagenesFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-2">
          {imagenesFiles.map((file, i) => (
            <img key={i} src={URL.createObjectURL(file)} className="w-full h-24 object-cover rounded-lg" />
          ))}
        </div>
      )}
      <input multiple type="file" accept="image/*" onChange={(e) => setImagenesFiles(Array.from(e.target.files))} className="w-full border rounded-lg px-3 py-2" />
    </div>
  </div>
);