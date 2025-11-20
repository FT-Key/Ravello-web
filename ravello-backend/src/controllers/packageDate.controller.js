// controllers/packageDate.controller.js
import { PackageDateService } from "../services/packageDate.service.js";

export const PackageDateController = {
  async create(req, res) {
    try {
      const data = await PackageDateService.createPackageDate(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { queryOptions, searchFilter, pagination } = req;
      const data = await PackageDateService.getAll(queryOptions, searchFilter, pagination);
      res.json({ success: true, ...data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await PackageDateService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async getByPackage(req, res) {
    try {
      const { queryOptions, searchFilter, pagination } = req;
      const data = await PackageDateService.getByPackage(
        req.params.packageId,
        queryOptions,
        searchFilter,
        pagination
      );
      res.json({ success: true, ...data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await PackageDateService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await PackageDateService.delete(req.params.id);
      res.json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
