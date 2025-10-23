import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPackage, updatePackage, getPackageById } from "../../services/packageService";
import { storage } from "../../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState({ name: "", description: "", price: 0, image: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (id) {
      getPackageById(id).then(setPkg);
    }
  }, [id]);

  const handleUpload = () => {
    if (!file) return Promise.resolve(pkg.image);
    const storageRef = ref(storage, `packages/${file.name}`);
    return uploadBytesResumable(storageRef, file).then(() => getDownloadURL(storageRef));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await handleUpload();
    const data = { ...pkg, image: imageUrl };
    if (id) await updatePackage(id, data);
    else await createPackage(data);
    navigate("/admin/packages");
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" value={pkg.name} onChange={e => setPkg({ ...pkg, name: e.target.value })} className="input" />
      <textarea placeholder="Descripción" value={pkg.description} onChange={e => setPkg({ ...pkg, description: e.target.value })} className="input" />
      <input type="number" placeholder="Precio" value={pkg.price} onChange={e => setPkg({ ...pkg, price: Number(e.target.value) })} className="input" />
      <input type="file" onChange={e => setFile(e.target.files[0])} className="input mt-2" />
      <button type="submit" className="btn-primary mt-4">{id ? "Actualizar" : "Crear"}</button>
    </form>
  );
};

export default PackageForm;
