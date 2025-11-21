// services/packageDate.service.js
import { PackageDate, Package } from "../models/index.js";

export const PackageDateService = {

  // ---------------------------------------------------------
  // 🟢 CREAR FECHA DE PAQUETE
  // ---------------------------------------------------------
  async createPackageDate(data) {
    const pkg = await Package.findById(data.package);
    if (!pkg) throw new Error("El paquete no existe");

    // Inconsistencias opcionales
    const inconsistencias = [];

    const sumaDestinos = pkg.destinos?.reduce(
      (acc, d) => acc + (d.diasEstadia || 0),
      0
    ) || 0;

    if (data.totalDias != null && sumaDestinos !== data.totalDias) {
      inconsistencias.push(
        `La suma de días por destino (${sumaDestinos}) no coincide con totalDias (${data.totalDias}).`
      );
    }

    data.inconsistencias = inconsistencias;
    data.validadoDestinos = inconsistencias.length === 0;
    data.validadoFechas = true;

    // create() → dispara pre("save")
    const created = await PackageDate.create(data);

    // ❗ Devuelve documento completo con populate
    const populated = await PackageDate.findById(created._id).populate("package");
    return populated;
  },

  // ---------------------------------------------------------
  // 🟢 LISTAR TODOS
  // ---------------------------------------------------------
  async getAll(queryOptions, searchFilter, pagination) {
    const query = {
      ...queryOptions.filters,
      ...searchFilter
    };

    const total = await PackageDate.countDocuments(query);

    let mongoQuery = PackageDate.find(query)
      .populate("package")
      .sort(queryOptions.sort);

    // 👇 Solo aplicar paginación si existe
    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const data = await mongoQuery;

    return {
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items: data
    };
  },

  // ---------------------------------------------------------
  // 🟢 LISTAR POR ID DE PAQUETE
  // ---------------------------------------------------------
  async getByPackage(packageId, queryOptions, searchFilter, pagination) {
    const query = {
      package: packageId,
      ...queryOptions.filters,
      ...searchFilter
    };

    const total = await PackageDate.countDocuments(query);

    let mongoQuery = PackageDate.find(query)
      .populate("package")
      .sort(queryOptions.sort);

    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const data = await mongoQuery;

    return {
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items: data
    };
  },

  // ---------------------------------------------------------
  // 🟢 OBTENER POR ID
  // ---------------------------------------------------------
  async getById(id) {
    const date = await PackageDate.findById(id).populate("package");
    if (!date) throw new Error("Fecha no encontrada");
    return date;
  },

  // ---------------------------------------------------------
  // 🟢 ACTUALIZAR FECHA DE PAQUETE
  // ---------------------------------------------------------
  async update(id, data) {
    const doc = await PackageDate.findById(id);
    if (!doc) throw new Error("No se pudo actualizar la fecha del paquete");

    // asignamos campos
    Object.assign(doc, data);

    // ❗ save() → dispara pre("save") → recalcula 'regreso'
    await doc.save();

    // devolver documento completo y populado
    const populated = await PackageDate.findById(id).populate("package");
    return populated;
  },

  // ---------------------------------------------------------
  // 🟢 ELIMINAR
  // ---------------------------------------------------------
  async delete(id) {
    const result = await PackageDate.findByIdAndDelete(id);
    if (!result) throw new Error("No existe esa fecha");
    return result;
  }
};
