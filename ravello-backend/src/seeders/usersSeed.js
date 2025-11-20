import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/index.js";

dotenv.config();

const usersData = [
  {
    nombre: "Administrador Principal",
    email: "admin@turismo.com",
    password: "admin123",
    rol: "admin",
    activo: true,
    esPrincipal: true,
  },
  {
    nombre: "Coordinador General",
    email: "coordinador@turismo.com",
    password: "coordinador123",
    rol: "editor",
    activo: true,
    esPrincipal: false,
  },
  {
    nombre: "Agente de Ventas",
    email: "ventas@turismo.com",
    password: "ventas123",
    rol: "editor",
    activo: true,
    esPrincipal: false,
  },
  {
    nombre: "Cliente Demo",
    email: "cliente@turismo.com",
    password: "cliente123",
    rol: "cliente",
    activo: true,
    esPrincipal: false,
  },
  {
    nombre: "Usuario Inactivo",
    email: "inactivo@turismo.com",
    password: "inactivo123",
    rol: "cliente",
    activo: false,
    esPrincipal: false,
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    console.log("🗑️  Eliminando usuarios previos...");
    await User.deleteMany();

    console.log("👥 Creando usuarios iniciales...");

    const createdUsers = await Promise.all(
      usersData.map((u) => User.create(u))
    );

    console.log(`✅ ${createdUsers.length} usuarios insertados correctamente.`);
    console.log("⭐ Admin principal:", createdUsers[0].email);
    console.log("🎉 Seed de usuarios completado.");

    process.exit();
  } catch (error) {
    console.error("❌ Error durante el seed de usuarios:", error);
    process.exit(1);
  }
};

seedUsers();
