import { packageService } from '../services/index.js';

export const getPackages = async (req, res) => {
  try {
    const packages = await packageService.getAllPackages();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPackage = async (req, res) => {
  try {
    const pack = await packageService.getPackageById(req.params.id);
    if (!pack) return res.status(404).json({ message: 'Paquete no encontrado' });
    res.json(pack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const pack = await packageService.createPackage(req.body);
    res.status(201).json(pack);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const pack = await packageService.updatePackage(req.params.id, req.body);
    res.json(pack);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    await packageService.deletePackage(req.params.id);
    res.json({ message: 'Paquete eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;

    const filters = {
      activo: true,
      visibleEnWeb: true,
      etiquetas: { $in: ['oferta'] },
      ...queryOptions.filters,
      ...searchFilter,
    };

    const data = await packageService.getPromotions(filters, queryOptions.sort, pagination);

    res.json(data);
  } catch (err) {
    console.error("❌ Error en getPromotions:", err);
    res.status(500).json({ error: err.message });
  }
};
