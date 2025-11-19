// services/packageDate.service.js
import { PackageDate, Package } from "../models/index.js";

export const PackageDateService = {

  async createPackageDate(data) {
    const pkg = await Package.findById(data.package);
    if (!pkg) throw new Error("El paquete no existe");

    const inconsistencias = [];

    // VALIDACIÓN 1 → fechas coherentes
    if (new Date(data.salida) >= new Date(data.regreso)) {
      inconsistencias.push("La fecha de salida debe ser anterior a la de regreso.");
    }

    // VALIDACIÓN 2 → recalcular totalDias
    const diasReales = Math.ceil(
      (new Date(data.regreso) - new Date(data.salida)) / (1000 * 60 * 60 * 24)
    );

    if (diasReales !== data.totalDias) {
      inconsistencias.push(
        `totalDias (${data.totalDias}) no coincide con los días reales (${diasReales}).`
      );
    }

    // VALIDACIÓN 3 → suma destinos
    const sumaDestinos = pkg.destinos.reduce((acc, d) => acc + (d.diasEstadia || 0), 0);

    if (sumaDestinos !== data.totalDias) {
      inconsistencias.push(
        `La suma de días por destino (${sumaDestinos}) no coincide con totalDias (${data.totalDias}).`
      );
    }

    data.inconsistencias = inconsistencias;
    data.validadoDestinos = inconsistencias.length === 0;
    data.validadoFechas = inconsistencias.length === 0;

    return await PackageDate.create(data);
  },

  async getAll(queryOptions, searchFilter, pagination) {
    const query = {
      ...queryOptions.filters,
      ...searchFilter
    };

    const total = await PackageDate.countDocuments(query);

    const data = await PackageDate.find(query)
      .populate("package")
      .sort(queryOptions.sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    return {
      total,
      page: pagination.page,
      limit: pagination.limit,
      data
    };
  },

  async getByPackage(packageId, queryOptions, searchFilter, pagination) {
    const query = {
      package: packageId,
      ...queryOptions.filters,
      ...searchFilter
    };

    const total = await PackageDate.countDocuments(query);

    const data = await PackageDate.find(query)
      .populate("package")
      .sort(queryOptions.sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    return {
      total,
      page: pagination.page,
      limit: pagination.limit,
      data
    };
  },

  async getById(id) {
    const date = await PackageDate.findById(id).populate("package");
    if (!date) throw new Error("Fecha no encontrada");
    return date;
  },

  async update(id, data) {
    const updated = await PackageDate.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!updated) throw new Error("No se pudo actualizar la fecha del paquete");

    return updated;
  },

  async delete(id) {
    const result = await PackageDate.findByIdAndDelete(id);
    if (!result) throw new Error("No existe esa fecha");
    return result;
  }
};
