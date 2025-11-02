import { Package } from '../models/index.js';

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
