import { Package } from '../models/index.js';

export const getPackages = async (filters = {}, sort = '-createdAt', pagination = { page: 1, limit: 12, skip: 0 }) => {
  const { limit, skip, page } = pagination;

  const [items, total] = await Promise.all([
    Package.find(filters).sort(sort).skip(skip).limit(limit),
    Package.countDocuments(filters),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
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
  const { limit, skip, page } = pagination;

  const [items, total] = await Promise.all([
    Package.find(filters).sort(sort).skip(skip).limit(limit),
    Package.countDocuments(filters),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getDestinosUnicos = async () => {
  const results = await Package.aggregate([
    {
      $unwind: {
        path: "$destinos",
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $group: {
        _id: { ciudad: "$destinos.ciudad", pais: "$destinos.pais" }
      }
    },
    {
      $project: {
        _id: 0,
        ciudad: "$_id.ciudad",
        pais: "$_id.pais"
      }
    },
    { $sort: { ciudad: 1 } }
  ]);

  return results;
};

