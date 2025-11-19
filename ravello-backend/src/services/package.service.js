// services/package.service.js
import { Package } from "../models/index.js";
import { imageService } from "./image.service.js";

export const packageService = {

  validateDurations(destinos, duracionReserva) {
    const totalDias = destinos.reduce((acc, d) => acc + (d.dias || 0), 0);
    if (totalDias > duracionReserva) {
      throw new Error(
        `La suma de días por destino (${totalDias}) excede la duración total del paquete (${duracionReserva}).`
      );
    }
  },

  // -------------------------------------------------------------
  // CONTROLADORES
  // -------------------------------------------------------------
  async getPackagesController(queryOptions, searchFilter, pagination) {
    const filters = {
      ...queryOptions.filters,
      ...searchFilter,
    };
    return await this.getPackages(filters, queryOptions.sort, pagination);
  },

  async getPackageByIdController(id) {
    const pack = await this.getPackageById(id);
    if (!pack) throw { status: 404, message: "Paquete no encontrado" };
    return pack;
  },

  async createPackageController(body, files) {
    const parsedBody = this.parseBody(body);
    this.validateDurations(parsedBody.destinos || [], parsedBody.duracionReserva);
    return await this.createWithImages(parsedBody, files);
  },

  async updatePackageController(id, body, files) {
    const parsedBody = this.parseBody(body);
    this.validateDurations(parsedBody.destinos || [], parsedBody.duracionReserva);
    return await this.updateWithImages(id, parsedBody, files);
  },

  async deletePackageController(id) {
    return await this.deleteWithImages(id);
  },

  async getPromotionsController(queryOptions, searchFilter, pagination) {
    const filters = {
      activo: true,
      visibleEnWeb: true,
      etiquetas: { $in: ["oferta"] },
      ...queryOptions.filters,
      ...searchFilter,
    };
    return await this.getPromotions(filters, queryOptions.sort, pagination);
  },

  async getDestinosUnicosController() {
    return await this.getDestinosUnicos();
  },

  // -------------------------------------------------------------
  // SAFE BODY PARSER
  // -------------------------------------------------------------
  parseBody(body) {
    const b = { ...body };

    if (typeof b.destinos === "string") {
      b.destinos = JSON.parse(b.destinos);
    }
    if (typeof b.salida === "string") {
      b.salida = JSON.parse(b.salida);
    }
    if (typeof b.regreso === "string") {
      b.regreso = JSON.parse(b.regreso);
    }
    if (typeof b.duracionReserva === "string") {
      b.duracionReserva = Number(b.duracionReserva);
    }

    return b;
  },

  // -------------------------------------------------------------
  // CRUD
  // -------------------------------------------------------------
  async getPackages(filters = {}, sort = "-createdAt", pagination = { page: 1, limit: 12, skip: 0 }) {
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
  },

  getPackageById(id) {
    return Package.findById(id);
  },

  createPackage(data) {
    return Package.create(data);
  },

  updatePackage(id, data) {
    return Package.findByIdAndUpdate(id, data, { new: true });
  },

  deletePackage(id) {
    return Package.findByIdAndDelete(id);
  },

  getPromotions(filters, sort, pagination) {
    return this.getPackages(filters, sort, pagination);
  },

  async getDestinosUnicos() {
    return await Package.aggregate([
      { $unwind: "$destinos" },
      {
        $group: {
          _id: { ciudad: "$destinos.ciudad", pais: "$destinos.pais" },
        },
      },
      {
        $project: {
          _id: 0,
          ciudad: "$_id.ciudad",
          pais: "$_id.pais",
        },
      },
      { $sort: { ciudad: 1 } },
    ]);
  },

  // -------------------------------------------------------------
  // IMAGES
  // -------------------------------------------------------------
  async createWithImages(body, files) {
    const imagenPrincipalFile = files?.imagenPrincipal?.[0];
    const imagenesFiles = files?.imagenes || [];

    if (!imagenPrincipalFile) throw new Error("imagenPrincipal es requerida");

    const uploads = [];

    try {
      // main
      const main = await imageService.upload(imagenPrincipalFile, "packages");
      uploads.push(main);

      const images = [];
      for (const f of imagenesFiles) {
        const up = await imageService.upload(f, "packages");
        uploads.push(up);
        images.push(up);
      }

      const data = {
        ...body,
        imagenPrincipal: { url: main.url, path: main.path },
        imagenes: images.map((i) => ({ url: i.url, path: i.path })),
      };

      return await this.createPackage(data);
    } catch (err) {
      await imageService.rollback(uploads);
      throw err;
    }
  },

  async updateWithImages(id, body, files) {
    const existing = await this.getPackageById(id);
    if (!existing) throw new Error("Paquete no encontrado");

    const newMain = files?.imagenPrincipal?.[0];
    const newImages = files?.imagenes || [];

    const removePaths = body.removePaths ? JSON.parse(body.removePaths) : [];

    const uploads = [];

    try {
      await imageService.deletePaths(removePaths);

      let imagenPrincipal = existing.imagenPrincipal;

      if (newMain) {
        const upMain = await imageService.upload(newMain, "packages");
        uploads.push(upMain);
        imagenPrincipal = { url: upMain.url, path: upMain.path };

        if (existing.imagenPrincipal?.path) {
          await imageService.delete(existing.imagenPrincipal.path);
        }
      }

      let imagenesArr = (existing.imagenes || []).filter(
        (img) => !removePaths.includes(img.path)
      );

      for (const f of newImages) {
        const up = await imageService.upload(f, "packages");
        uploads.push(up);
        imagenesArr.push({ url: up.url, path: up.path });
      }

      const updateData = {
        ...body,
        imagenPrincipal,
        imagenes: imagenesArr,
      };

      return await this.updatePackage(id, updateData);
    } catch (err) {
      await imageService.rollback(uploads);
      throw err;
    }
  },

  async deleteWithImages(id) {
    const existing = await this.getPackageById(id);
    if (!existing) throw new Error("Paquete no encontrado");

    const paths = [];

    if (existing.imagenPrincipal?.path) paths.push(existing.imagenPrincipal.path);
    if (Array.isArray(existing.imagenes)) {
      existing.imagenes.forEach((i) => paths.push(i.path));
    }

    await imageService.deletePaths(paths);
    await this.deletePackage(id);

    return { message: "Paquete eliminado" };
  },
};
