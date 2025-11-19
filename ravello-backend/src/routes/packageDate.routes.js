// routes/packageDate.routes.js
import express from "express";
import { PackageDateController } from "../controllers/packageDate.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { packageDateSchema } from "../validations/packageDate.validations.js";
import {
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
} from "../middlewares/index.js";

const router = express.Router();

// LISTAR TODAS (con filtros, search y paginación)
router.get(
  "/",
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  PackageDateController.getAll
);

// LISTAR POR ID DE PAQUETE
router.get(
  "/by-package/:packageId",
  queryMiddleware,
  searchMiddleware,
  paginationMiddleware,
  PackageDateController.getByPackage
);

// OBTENER UNA FECHA POR ID
router.get("/:id", PackageDateController.getById);

// CREAR
router.post(
  "/",
  validateRequest(packageDateSchema),
  PackageDateController.create
);

// EDITAR
router.put(
  "/:id",
  validateRequest(packageDateSchema),
  PackageDateController.update
);

// ELIMINAR
router.delete("/:id", PackageDateController.delete);

export default router;
