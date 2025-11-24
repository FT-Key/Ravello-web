// services/packageDate.service.js
import mongoose from "mongoose";
import { PackageDate, Package } from "../models/index.js";

export const PackageDateService = {

  async createPackageDate(data) {
    const pkg = await Package.findById(data.package);
    if (!pkg) throw new Error("El paquete no existe");

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

    const created = await PackageDate.create(data);
    const populated = await PackageDate.findById(created._id).populate("package");
    return populated;
  },

  // ---------------------------------------------------------
  // 🟢 LISTAR TODOS - CON BÚSQUEDA EN PAQUETES
  // ---------------------------------------------------------
  async getAll(queryOptions, searchFilter, pagination) {
    let query = { ...queryOptions.filters };

    // 🔥 Si hay búsqueda, buscar TAMBIÉN en nombres de paquetes
    if (searchFilter && searchFilter.$or && searchFilter.$or.length > 0) {
      // Extraer el término de búsqueda del primer campo
      const searchTerm = searchFilter.$or[0]?.[Object.keys(searchFilter.$or[0])[0]]?.$regex;
      
      if (searchTerm) {
        console.log("🔍 Término de búsqueda:", searchTerm);

        // 1. Buscar paquetes que coincidan con el término
        const matchingPackages = await Package.find({
          nombre: { $regex: searchTerm, $options: 'i' }
        }).select('_id');

        const packageIds = matchingPackages.map(p => p._id);
        console.log(`📦 Paquetes encontrados: ${packageIds.length}`);

        // 2. Construir búsqueda combinada
        const validFields = ['estado', 'moneda', 'notas'];
        const validSearchConditions = searchFilter.$or.filter(condition => {
          const field = Object.keys(condition)[0];
          return validFields.includes(field);
        });

        // 3. Combinar: búsqueda en campos propios O en paquetes encontrados
        const searchConditions = [
          ...validSearchConditions,
          { package: { $in: packageIds } }
        ];

        if (Object.keys(query).length > 0) {
          // Si hay filtros adicionales (estado, moneda), combinar con AND
          query = {
            $and: [
              query,
              { $or: searchConditions }
            ]
          };
        } else {
          // Si no hay filtros, solo la búsqueda
          query.$or = searchConditions;
        }
      }
    }

    console.log("🔍 Query final:", JSON.stringify(query, null, 2));

    try {
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

      console.log(`✅ Resultados encontrados: ${data.length} de ${total} total`);

      return {
        total,
        page: pagination?.page || null,
        limit: pagination?.limit || null,
        items: data
      };
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      throw new Error(`Error buscando package dates: ${error.message}`);
    }
  },

  // ---------------------------------------------------------
  // 🟢 LISTAR POR ID DE PAQUETE
  // ---------------------------------------------------------
  async getByPackage(packageId, queryOptions, searchFilter, pagination) {
    let query = {
      package: packageId,
      ...queryOptions.filters,
    };

    if (searchFilter && searchFilter.$or && searchFilter.$or.length > 0) {
      const validFields = ['estado', 'moneda', 'notas'];
      
      const validSearchConditions = searchFilter.$or.filter(condition => {
        const field = Object.keys(condition)[0];
        return validFields.includes(field);
      });

      if (validSearchConditions.length > 0) {
        const baseQuery = { package: packageId, ...queryOptions.filters };
        query = {
          $and: [
            baseQuery,
            { $or: validSearchConditions }
          ]
        };
      }
    }

    console.log("🔍 Query getByPackage:", JSON.stringify(query, null, 2));

    try {
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
    } catch (error) {
      console.error("❌ Error en getByPackage:", error);
      throw new Error(`Error buscando package dates por paquete: ${error.message}`);
    }
  },

  async getById(id) {
    const date = await PackageDate.findById(id).populate("package");
    if (!date) throw new Error("Fecha no encontrada");
    return date;
  },

  async update(id, data) {
    const doc = await PackageDate.findById(id);
    if (!doc) throw new Error("No se pudo actualizar la fecha del paquete");

    Object.assign(doc, data);
    await doc.save();

    const populated = await PackageDate.findById(id).populate("package");
    return populated;
  },

  async delete(id) {
    const result = await PackageDate.findByIdAndDelete(id);
    if (!result) throw new Error("No existe esa fecha");
    return result;
  }
};