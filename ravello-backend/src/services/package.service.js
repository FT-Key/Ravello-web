// services/package.service.js
import { Package } from "../models/index.js";
import { imageService } from "./image.service.js";

export const packageService = {
  // 🔵 Controlador delega aquí
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
    return await this.createWithImages(body, files);
  },

  async updatePackageController(id, body, files) {
    console.log("📌 [SERVICE] --> updatePackageController()");
    console.log("📌 ID:", id);
    console.log("📌 Body:", body);
    console.log("📌 Files keys:", Object.keys(files || {}));

    return await this.updateWithImages(id, body, files);
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

  // 🔵 Servicios CRUD
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

  // 🔵 Lógica de imágenes — antes en el controller
  async createWithImages(body, files) {
    const imagenPrincipalFile = files?.imagenPrincipal?.[0];
    const imagenesFiles = files?.imagenes || [];

    if (!imagenPrincipalFile) {
      throw new Error("imagenPrincipal es requerida");
    }

    const uploads = [];

    try {
      // subir main
      const main = await imageService.upload(imagenPrincipalFile, "packages");
      uploads.push(main);

      // subir adicionales
      const images = [];
      for (const f of imagenesFiles) {
        const up = await imageService.upload(f, "packages");
        uploads.push(up);
        images.push(up);
      }

      // construir data
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
    console.log("📌 [SERVICE] --> updateWithImages()");
    console.log("📌 ID recibido:", id);
    console.log("📌 Body recibido:", body);
    console.log("📌 Files recibido:", Object.keys(files || {}));

    const existing = await this.getPackageById(id);
    console.log("📌 Paquete encontrado:", !!existing);

    if (!existing) throw new Error("Paquete no encontrado");

    const newMain = files?.imagenPrincipal?.[0];
    const newImages = files?.imagenes || [];

    console.log("📌 ¿Trae nueva imagen principal?:", !!newMain);
    console.log("📌 Cantidad de imágenes nuevas:", newImages.length);

    const removePaths = body.removePaths ? JSON.parse(body.removePaths) : [];
    console.log("📌 removePaths:", removePaths);

    const uploads = [];

    try {
      // borrar imágenes solicitadas
      console.log("📌 Intentando borrar imágenes:", removePaths);
      await imageService.deletePaths(removePaths);
      console.log("✅ deletePaths OK");

      // actualizar main
      let imagenPrincipal = existing.imagenPrincipal;

      if (newMain) {
        console.log("📌 Subiendo nueva imagen principal...");
        const upMain = await imageService.upload(newMain, "packages");
        console.log("✅ Nueva imagen principal subida:", upMain);

        uploads.push(upMain);
        imagenPrincipal = { url: upMain.url, path: upMain.path };

        if (existing.imagenPrincipal?.path) {
          console.log("📌 Eliminando imagen principal anterior...");
          await imageService.delete(existing.imagenPrincipal.path);
        }
      }

      // actualizar array de imágenes
      console.log("📌 Procesando nuevas imágenes adicionales...");
      let imagenesArr = (existing.imagenes || []).filter(
        (img) => !removePaths.includes(img.path)
      );
      console.log("📌 Imagenes después de filtrar:", imagenesArr.length);

      for (const f of newImages) {
        console.log("📌 Subiendo imagen adicional...");
        const up = await imageService.upload(f, "packages");
        console.log("   ➤ subida:", up);

        uploads.push(up);
        imagenesArr.push({ url: up.url, path: up.path });
      }

      const updateData = {
        ...body,
        imagenPrincipal,
        imagenes: imagenesArr,
      };

      console.log("📌 UpdateData final:", updateData);

      const result = await this.updatePackage(id, updateData);
      console.log("✅ Paquete actualizado correctamente");

      return result;
    } catch (err) {
      console.error("❌ [SERVICE] Error en updateWithImages:", err);
      console.log("📌 Ejecutando rollback de imágenes subidas...");
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
