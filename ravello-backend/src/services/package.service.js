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
  // CRUD - getAll con búsqueda y paginación
  // -------------------------------------------------------------
  async getAll(queryOptions, searchFilter, pagination) {
    const query = {
      ...queryOptions.filters,
      ...searchFilter,
    };

    console.log("🔍 Query getAll packages:", JSON.stringify(query, null, 2));

    try {
      const total = await Package.countDocuments(query);

      let mongoQuery = Package.find(query).sort(queryOptions.sort);

      if (pagination) {
        mongoQuery = mongoQuery
          .skip(pagination.skip)
          .limit(pagination.limit);
      }

      const items = await mongoQuery;

      console.log(`✅ Paquetes encontrados: ${items.length} de ${total} total`);

      return {
        total,
        page: pagination?.page || null,
        limit: pagination?.limit || null,
        items
      };
    } catch (error) {
      console.error("❌ Error en getAll packages:", error);
      throw new Error(`Error buscando paquetes: ${error.message}`);
    }
  },

  // -------------------------------------------------------------
  // GET BY ID
  // -------------------------------------------------------------
  async getById(id) {
    const pack = await Package.findById(id);
    if (!pack) throw new Error("Paquete no encontrado");
    return pack;
  },

  // -------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------
  async create(body, files) {
    const parsedBody = this.parseBody(body);
    this.validateDurations(parsedBody.destinos || [], parsedBody.duracionReserva);
    return await this.createWithImages(parsedBody, files);
  },

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  async update(id, body, files) {
    const parsedBody = this.parseBody(body);
    this.validateDurations(parsedBody.destinos || [], parsedBody.duracionReserva);
    return await this.updateWithImages(id, parsedBody, files);
  },

  // -------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------
  async delete(id) {
    return await this.deleteWithImages(id);
  },

  // -------------------------------------------------------------
  // PROMOCIONES - con búsqueda y paginación
  // -------------------------------------------------------------
  async getPromotions(queryOptions, searchFilter, pagination) {
    const query = {
      activo: true,
      visibleEnWeb: true,
      etiquetas: { $in: ["oferta"] },
      ...queryOptions.filters,
      ...searchFilter,
    };

    console.log("🔍 Query promociones:", JSON.stringify(query, null, 2));

    try {
      const total = await Package.countDocuments(query);

      let mongoQuery = Package.find(query).sort(queryOptions.sort);

      if (pagination) {
        mongoQuery = mongoQuery
          .skip(pagination.skip)
          .limit(pagination.limit);
      }

      const items = await mongoQuery;

      console.log(`✅ Promociones encontradas: ${items.length} de ${total} total`);

      return {
        total,
        page: pagination?.page || null,
        limit: pagination?.limit || null,
        items
      };
    } catch (error) {
      console.error("❌ Error en getPromotions:", error);
      throw new Error(`Error buscando promociones: ${error.message}`);
    }
  },

  // -------------------------------------------------------------
  // DESTINOS ÚNICOS
  // -------------------------------------------------------------
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

      return await Package.create(data);
    } catch (err) {
      await imageService.rollback(uploads);
      throw err;
    }
  },

  async updateWithImages(id, body, files) {
    const existing = await Package.findById(id);
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

      return await Package.findByIdAndUpdate(id, updateData, { new: true });
    } catch (err) {
      await imageService.rollback(uploads);
      throw err;
    }
  },

  async deleteWithImages(id) {
    const existing = await Package.findById(id);
    if (!existing) throw new Error("Paquete no encontrado");

    const paths = [];

    if (existing.imagenPrincipal?.path) paths.push(existing.imagenPrincipal.path);
    if (Array.isArray(existing.imagenes)) {
      existing.imagenes.forEach((i) => paths.push(i.path));
    }

    await imageService.deletePaths(paths);
    await Package.findByIdAndDelete(id);

    return { message: "Paquete eliminado" };
  },
};