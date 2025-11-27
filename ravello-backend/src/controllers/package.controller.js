// controllers/packages.controller.js
import { packageService } from "../services/package.service.js";

export const getPackages = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await packageService.getAll(queryOptions, searchFilter, pagination);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("❌ Error en getPackages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPackage = async (req, res) => {
  try {
    const data = await packageService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en getPackage:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const data = await packageService.create(req.body, req.files);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en createPackage:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  console.log("📌 [CONTROLLER] --> Entró a updatePackage()");
  try {
    const data = await packageService.update(req.params.id, req.body, req.files);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ [CONTROLLER] Error en updatePackage:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    await packageService.delete(req.params.id);
    res.json({ success: true, message: "Paquete eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deletePackage:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await packageService.getPromotions(queryOptions, searchFilter, pagination);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("❌ Error en getPromotions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDestinosUnicos = async (req, res) => {
  try {
    const data = await packageService.getDestinosUnicos();
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en getDestinosUnicos:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};