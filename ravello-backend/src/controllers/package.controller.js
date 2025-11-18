// controllers/packages.controller.js
import { packageService } from "../services/package.service.js";

export const getPackages = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await packageService.getPackagesController(queryOptions, searchFilter, pagination);
    res.json(data);
  } catch (err) {
    console.error("❌ Error en getPackages:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPackage = async (req, res) => {
  try {
    const data = await packageService.getPackageByIdController(req.params.id);
    res.json(data);
  } catch (err) {
    console.error("❌ Error en getPackage:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const result = await packageService.createPackageController(req.body, req.files);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error en createPackage:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePackage = async (req, res) => {
  console.log("📌 [CONTROLLER] --> Entró a updatePackage()");
  console.log("📌 Params recibidos:", req.params);
  console.log("📌 Body recibido:", req.body);
  console.log("📌 Files recibidos:", Object.keys(req.files || {}));

  if (req.files) {
    console.log("📌 imagenPrincipal:", req.files.imagenPrincipal?.length || 0);
    console.log("📌 imagenes:", req.files.imagenes?.length || 0);
  }

  try {
    const result = await packageService.updatePackageController(
      req.params.id,
      req.body,
      req.files
    );

    console.log("✅ [CONTROLLER] updatePackage finalizó OK");
    res.json(result);
  } catch (err) {
    console.error("❌ [CONTROLLER] Error en updatePackage:", err);
    res.status(500).json({ error: err.message });
  }
};


export const deletePackage = async (req, res) => {
  try {
    const result = await packageService.deletePackageController(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("❌ Error en deletePackage:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const result = await packageService.getPromotionsController(queryOptions, searchFilter, pagination);
    res.json(result);
  } catch (err) {
    console.error("❌ Error en getPromotions:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getDestinosUnicos = async (req, res) => {
  try {
    const result = await packageService.getDestinosUnicosController();
    res.json(result);
  } catch (err) {
    console.error("❌ Error en getDestinosUnicos:", err);
    res.status(500).json({ error: err.message });
  }
};
