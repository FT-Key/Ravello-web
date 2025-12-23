import * as userService from "../services/user.service.js";

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await userService.getAll(queryOptions, searchFilter, pagination);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("❌ Error en getUsers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const data = await userService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  try {
    const data = await userService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en createUser:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const data = await userService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en updateUser:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteUser:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// controllers/user.controller.js

// Obtener perfil del usuario actual
export async function obtenerPerfilController(req, res) {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      success: true,
      data: user.datosSinPassword(),
      perfilCompleto: user.perfilCompleto,
      camposFaltantes: user.camposFaltantes(),
      puedeReservar: user.puedeReservar()
    });

  } catch (error) {
    console.error('Error en obtenerPerfilController:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil'
    });
  }
}

// Actualizar perfil del usuario
export async function actualizarPerfilController(req, res) {
  try {
    const userId = req.user._id;
    
    const {
      nombre,
      apellido,
      telefono,
      documento,
      fechaNacimiento,
      direccion,
      preferencias
    } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (telefono) user.telefono = telefono;
    if (documento) user.documento = documento;
    if (fechaNacimiento) user.fechaNacimiento = fechaNacimiento;
    if (direccion) user.direccion = { ...user.direccion, ...direccion };
    if (preferencias) user.preferencias = { ...user.preferencias, ...preferencias };

    await user.save();

    return res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user.datosSinPassword(),
      perfilCompleto: user.perfilCompleto,
      camposFaltantes: user.camposFaltantes()
    });

  } catch (error) {
    console.error('Error en actualizarPerfilController:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar el perfil'
    });
  }
}

// Verificar si el usuario puede hacer reservas
export async function verificarPuedeReservarController(req, res) {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const puedeReservar = user.puedeReservar();
    const camposFaltantes = user.camposFaltantes();

    return res.json({
      success: true,
      puedeReservar,
      perfilCompleto: user.perfilCompleto,
      camposFaltantes,
      mensaje: puedeReservar 
        ? 'Usuario habilitado para reservar' 
        : `Debe completar los siguientes campos: ${camposFaltantes.join(', ')}`
    });

  } catch (error) {
    console.error('Error en verificarPuedeReservarController:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar el perfil'
    });
  }
}