// seeders/userSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/index.js";

dotenv.config();

const usersData = [
  // ============================================
  // 👑 ADMINISTRADOR PRINCIPAL - PERFIL COMPLETO
  // ============================================
  {
    nombre: "Carlos Alberto",
    apellido: "Rodríguez",
    email: "admin@turismo.com",
    password: "admin123",
    telefono: "+54 381 4567890",
    documento: {
      tipo: "DNI",
      numero: "20123456"
    },
    fechaNacimiento: new Date("1985-03-15"),
    direccion: {
      calle: "Av. Mate de Luna",
      numero: "1234",
      piso: "5",
      departamento: "A",
      ciudad: "San Miguel de Tucumán",
      provincia: "Tucumán",
      codigoPostal: "4000",
      pais: "Argentina"
    },
    rol: "admin",
    activo: true,
    esPrincipal: true,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: true,
      idioma: "es",
      monedaPreferida: "ARS"
    }
  },

  // ============================================
  // 📝 COORDINADOR - PERFIL COMPLETO
  // ============================================
  {
    nombre: "María Laura",
    apellido: "Gómez",
    email: "coordinador@turismo.com",
    password: "coordinador123",
    telefono: "+54 381 5123456",
    documento: {
      tipo: "DNI",
      numero: "30456789"
    },
    fechaNacimiento: new Date("1990-07-22"),
    direccion: {
      calle: "25 de Mayo",
      numero: "567",
      ciudad: "San Miguel de Tucumán",
      provincia: "Tucumán",
      codigoPostal: "4000",
      pais: "Argentina"
    },
    rol: "editor",
    activo: true,
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: false,
      idioma: "es",
      monedaPreferida: "ARS"
    }
  },

  // ============================================
  // 💼 AGENTE DE VENTAS - PERFIL COMPLETO
  // ============================================
  {
    nombre: "Juan Pablo",
    apellido: "Fernández",
    email: "ventas@turismo.com",
    password: "ventas123",
    telefono: "+54 381 6789012",
    documento: {
      tipo: "DNI",
      numero: "35789012"
    },
    fechaNacimiento: new Date("1992-11-10"),
    direccion: {
      calle: "San Martín",
      numero: "890",
      ciudad: "San Miguel de Tucumán",
      provincia: "Tucumán",
      codigoPostal: "4000",
      pais: "Argentina"
    },
    rol: "editor",
    activo: true,
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: true,
      idioma: "es",
      monedaPreferida: "USD"
    }
  },

  // ============================================
  // ✅ CLIENTE CON PERFIL COMPLETO - PUEDE RESERVAR
  // ============================================
  {
    nombre: "Ana María",
    apellido: "López",
    email: "cliente@turismo.com",
    password: "cliente123",
    telefono: "+54 381 7890123",
    documento: {
      tipo: "DNI",
      numero: "40123456"
    },
    fechaNacimiento: new Date("1995-05-18"),
    direccion: {
      calle: "Congreso",
      numero: "456",
      ciudad: "San Miguel de Tucumán",
      provincia: "Tucumán",
      codigoPostal: "4000",
      pais: "Argentina"
    },
    rol: "cliente",
    activo: true,
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: false,
      idioma: "es",
      monedaPreferida: "ARS"
    },
    estadisticas: {
      totalReservas: 5,
      reservasCompletadas: 4,
      reservasCanceladas: 1,
      totalGastado: 125000,
      ultimaReserva: new Date("2024-11-15"),
      clienteDesde: new Date("2023-01-10")
    }
  },

  // ============================================
  // ⚠️ CLIENTE CON PERFIL INCOMPLETO - SIN TELÉFONO
  // ============================================
  {
    nombre: "Pedro",
    apellido: "Martínez",
    email: "pedro@turismo.com",
    password: "pedro123",
    // telefono: undefined, // <- Falta teléfono
    documento: {
      tipo: "DNI",
      numero: "38456789"
    },
    fechaNacimiento: new Date("1993-08-25"),
    rol: "cliente",
    activo: true,
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: false,
      notificacionesEmail: true,
      notificacionesSMS: false,
      idioma: "es",
      monedaPreferida: "ARS"
    }
  },

  // ============================================
  // ⚠️ CLIENTE CON PERFIL INCOMPLETO - SIN DOCUMENTO
  // ============================================
  {
    nombre: "Lucía",
    apellido: "Ramírez",
    email: "lucia@turismo.com",
    password: "lucia123",
    telefono: "+54 381 8901234",
    // documento: undefined, // <- Falta documento
    fechaNacimiento: new Date("1996-02-14"),
    rol: "cliente",
    activo: true,
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: true,
      idioma: "es",
      monedaPreferida: "USD"
    }
  },

  // ============================================
  // ⚠️ CLIENTE CON PERFIL INCOMPLETO - SIN APELLIDO
  // ============================================
  {
    nombre: "Roberto",
    // apellido: undefined, // <- Falta apellido
    email: "roberto@turismo.com",
    password: "roberto123",
    telefono: "+54 381 9012345",
    documento: {
      tipo: "DNI",
      numero: "42789012"
    },
    fechaNacimiento: new Date("1998-12-30"),
    rol: "cliente",
    activo: true,
    esPrincipal: false,
    emailVerificado: false,
    preferencias: {
      newsletter: false,
      notificacionesEmail: false,
      notificacionesSMS: false,
      idioma: "es",
      monedaPreferida: "ARS"
    }
  },

  // ============================================
  // ⚠️ CLIENTE CON PERFIL VACÍO - SOLO EMAIL
  // ============================================
  {
    // nombre: undefined,
    // apellido: undefined,
    email: "nuevo@turismo.com",
    password: "nuevo123",
    // telefono: undefined,
    // documento: undefined,
    rol: "cliente",
    activo: true,
    esPrincipal: false,
    emailVerificado: false,
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: false,
      idioma: "es",
      monedaPreferida: "ARS"
    }
  },

  // ============================================
  // ❌ USUARIO INACTIVO - PERFIL COMPLETO PERO NO PUEDE RESERVAR
  // ============================================
  {
    nombre: "Inactivo",
    apellido: "Usuario",
    email: "inactivo@turismo.com",
    password: "inactivo123",
    telefono: "+54 381 1234567",
    documento: {
      tipo: "DNI",
      numero: "25678901"
    },
    fechaNacimiento: new Date("1988-09-05"),
    direccion: {
      calle: "Laprida",
      numero: "123",
      ciudad: "San Miguel de Tucumán",
      provincia: "Tucumán",
      codigoPostal: "4000",
      pais: "Argentina"
    },
    rol: "cliente",
    activo: false, // <- Usuario desactivado
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: false,
      notificacionesEmail: false,
      notificacionesSMS: false,
      idioma: "es",
      monedaPreferida: "ARS"
    }
  },

  // ============================================
  // 🧪 CLIENTE DE PRUEBA - PERFIL COMPLETO CON PASAPORTE
  // ============================================
  {
    nombre: "Carlos",
    apellido: "Extranjero",
    email: "extranjero@turismo.com",
    password: "extranjero123",
    telefono: "+1 555 1234567",
    documento: {
      tipo: "Pasaporte",
      numero: "A12345678"
    },
    fechaNacimiento: new Date("1987-04-20"),
    direccion: {
      calle: "Main Street",
      numero: "100",
      ciudad: "Miami",
      provincia: "Florida",
      codigoPostal: "33101",
      pais: "Estados Unidos"
    },
    rol: "cliente",
    activo: true,
    esPrincipal: false,
    emailVerificado: true,
    fechaVerificacion: new Date(),
    preferencias: {
      newsletter: true,
      notificacionesEmail: true,
      notificacionesSMS: true,
      idioma: "en",
      monedaPreferida: "USD"
    }
  }
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

    console.log("\n✅ Usuarios creados exitosamente!\n");
    console.log("═".repeat(70));
    console.log("📋 RESUMEN DE USUARIOS CREADOS");
    console.log("═".repeat(70));

    // Agrupar por tipo
    const admins = createdUsers.filter(u => u.rol === 'admin');
    const editors = createdUsers.filter(u => u.rol === 'editor');
    const clientes = createdUsers.filter(u => u.rol === 'cliente');

    console.log("\n👑 ADMINISTRADORES:");
    admins.forEach(u => {
      console.log(`   ✓ ${u.email}`);
      console.log(`     Password: admin123`);
      console.log(`     Perfil Completo: ${u.perfilCompleto ? '✅' : '❌'}`);
    });

    console.log("\n📝 EDITORES:");
    editors.forEach(u => {
      console.log(`   ✓ ${u.email}`);
      console.log(`     Perfil Completo: ${u.perfilCompleto ? '✅' : '❌'}`);
    });

    console.log("\n👥 CLIENTES:");
    clientes.forEach(u => {
      console.log(`   ${u.activo ? '✓' : '✗'} ${u.email}`);
      console.log(`     Password: ${u.email.split('@')[0]}123`);
      console.log(`     Perfil Completo: ${u.perfilCompleto ? '✅' : '❌'}`);
      console.log(`     Puede Reservar: ${u.puedeReservar() ? '✅' : '❌'}`);
      if (!u.perfilCompleto) {
        const faltantes = u.camposFaltantes();
        console.log(`     Campos faltantes: ${faltantes.join(', ')}`);
      }
      console.log(`     Estado: ${u.activo ? 'Activo 🟢' : 'Inactivo 🔴'}`);
      console.log("");
    });

    console.log("═".repeat(70));
    console.log("\n📊 ESTADÍSTICAS:");
    console.log(`   Total usuarios: ${createdUsers.length}`);
    console.log(`   Perfiles completos: ${createdUsers.filter(u => u.perfilCompleto).length}`);
    console.log(`   Perfiles incompletos: ${createdUsers.filter(u => !u.perfilCompleto).length}`);
    console.log(`   Pueden reservar: ${createdUsers.filter(u => u.puedeReservar()).length}`);
    console.log(`   Usuarios activos: ${createdUsers.filter(u => u.activo).length}`);
    console.log(`   Usuarios inactivos: ${createdUsers.filter(u => !u.activo).length}`);

    console.log("\n═".repeat(70));
    console.log("🧪 CASOS DE PRUEBA DISPONIBLES:");
    console.log("═".repeat(70));
    console.log("\n1️⃣  Perfil completo → Puede reservar inmediatamente");
    console.log("   📧 cliente@turismo.com");
    console.log("   🔑 cliente123");
    
    console.log("\n2️⃣  Sin teléfono → Debe completar 1 campo");
    console.log("   📧 pedro@turismo.com");
    console.log("   🔑 pedro123");
    
    console.log("\n3️⃣  Sin documento → Debe completar 1 campo");
    console.log("   📧 lucia@turismo.com");
    console.log("   🔑 lucia123");
    
    console.log("\n4️⃣  Sin apellido → Debe completar 1 campo");
    console.log("   📧 roberto@turismo.com");
    console.log("   🔑 roberto123");
    
    console.log("\n5️⃣  Perfil vacío → Debe completar 4 campos");
    console.log("   📧 nuevo@turismo.com");
    console.log("   🔑 nuevo123");
    
    console.log("\n6️⃣  Usuario inactivo → No puede reservar aunque perfil completo");
    console.log("   📧 inactivo@turismo.com");
    console.log("   🔑 inactivo123");

    console.log("\n7️⃣  Usuario extranjero con pasaporte");
    console.log("   📧 extranjero@turismo.com");
    console.log("   🔑 extranjero123");

    console.log("\n═".repeat(70));
    console.log("🎉 Seed completado exitosamente!");
    console.log("═".repeat(70) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seed de usuarios:", error);
    console.error(error.stack);
    process.exit(1);
  }
};

seedUsers();