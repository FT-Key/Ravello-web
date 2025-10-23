import Package from "../models/packageModel.js";

export const getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    next(err);
  }
};

export const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Paquete no encontrado" });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

export const createPackage = async (req, res, next) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    next(err);
  }
};

export const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
};

export const deletePackage = async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "Paquete eliminado" });
  } catch (err) {
    next(err);
  }
};
