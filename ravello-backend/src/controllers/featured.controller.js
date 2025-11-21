import { featuredService } from '../services/index.js';

export const getActiveFeatured = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;

    let featured = await featuredService.getActiveFeatured({
      filters: searchFilter,
      sort: queryOptions.sort,
      pagination // puede ser null
    });

    if (!featured)
      return res.status(404).json({ message: 'No hay sección de destacados activa' });

    // ordenamos por orden manual
    featured.items.sort((a, b) => a.orden - b.orden);

    res.json(featured);
  } catch (error) {
    console.error('❌ Error al obtener los destacados activos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getAllFeatured = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;

    const featured = await featuredService.getAllFeatured({
      filters: searchFilter,
      sort: queryOptions.sort,
      pagination // puede ser null
    });

    res.json(featured);
  } catch (error) {
    console.error('❌ Error al obtener todas las secciones de destacados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createFeatured = async (req, res) => {
  try {
    const featured = await featuredService.createFeatured(req.body);
    res.status(201).json(featured);
  } catch (error) {
    console.error('❌ Error al crear la sección de destacados:', error);
    res.status(400).json({ message: 'Error al crear la sección', error });
  }
};

export const updateFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await featuredService.updateFeatured(id, req.body);

    if (!updated)
      return res.status(404).json({ message: 'Sección de destacados no encontrada' });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar la sección de destacados:', error);
    res.status(400).json({ message: 'Error al actualizar la sección', error });
  }
};

export const deleteFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await featuredService.deleteFeatured(id);

    if (!deleted)
      return res.status(404).json({ message: 'Sección de destacados no encontrada' });

    res.json({ message: 'Sección de destacados eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar la sección de destacados:', error);
    res.status(500).json({ message: 'Error al eliminar la sección' });
  }
};
