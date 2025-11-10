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

export const getPromotions = async (filters, sort, pagination) => {
  console.log("🟦 [SERVICE] getPromotions() iniciado");
  console.log("🔍 Filtros recibidos:", filters);
  console.log("⚙️ Opciones recibidas:", pagination, "Sort:", sort);

  const { limit, skip } = pagination;

  const [items, total] = await Promise.all([
    Package.find(filters).sort(sort).skip(skip).limit(limit),
    Package.countDocuments(filters),
  ]);

  console.log(`📦 Paquetes encontrados: ${items.length}`, items);
  return {
    items,
    pagination: {
      total,
      page: pagination.page,
      pages: Math.ceil(total / limit),
    },
  };
};