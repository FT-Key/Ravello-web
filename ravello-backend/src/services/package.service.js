import { Package, Offer } from '../models/index.js';

export const getAllPackages = async () => {
  return await Package.find().sort({ createdAt: -1 });
};

export const getPackageById = async (id) => {
  return await Package.findById(id);
};

export const createPackage = async (data) => {
  const newPackage = new Package(data);
  return await newPackage.save();
};

export const updatePackage = async (id, data) => {
  return await Package.findByIdAndUpdate(id, data, { new: true });
};

export const deletePackage = async (id) => {
  return await Package.findByIdAndDelete(id);
};

export const getPromotions = async () => {
  try {
    // Buscar paquetes relevantes (solo 10 para rendimiento)
    const packages = await Package.find({
      activo: true,
      visibleEnWeb: true,
      etiquetas: { $in: ['oferta', 'nuevo', 'mas vendido', 'recomendado', 'exclusivo'] },
    })
      .select('nombre descripcionCorta imagenPrincipal etiquetas') // solo los campos que necesitás
      .limit(10)
      .lean();

    // Si no hay resultados, devolvés vacío
    if (!packages || packages.length === 0) return [];

    // Buscar ofertas activas de esos paquetes
    const packageIds = packages.map((p) => p._id);
    const offers = await Offer.find({
      packageId: { $in: packageIds },
      activa: true,
    })
      .select('packageId tipo valor')
      .lean();

    // Combinar la información de cada paquete con su oferta si existe
    const promos = packages.map((pkg) => {
      const offer = offers.find((o) => o.packageId.toString() === pkg._id.toString());

      let ofertaTexto = null;
      if (offer) {
        if (offer.tipo === 'porcentaje') ofertaTexto = `${offer.valor}% OFF`;
        else if (offer.tipo === 'monto') ofertaTexto = `-$${offer.valor}`;
        else ofertaTexto = '¡Oferta especial!';
      }

      return {
        id: pkg._id,
        nombre: pkg.nombre,
        descripcionCorta: pkg.descripcionCorta,
        imagenPrincipal: pkg.imagenPrincipal,
        etiquetas: pkg.etiquetas,
        oferta: ofertaTexto,
      };
    });

    // Seleccionar 2 al azar
    const seleccionadas = promos.sort(() => 0.5 - Math.random()).slice(0, 2);

    return seleccionadas;
  } catch (error) {
    console.error('Error en getPromotions:', error);
    throw new Error('No se pudieron cargar las promociones');
  }
};