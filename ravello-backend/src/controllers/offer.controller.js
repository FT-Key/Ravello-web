import { offerService } from '../services/index.js';

export const getAll = async (req, res) => {
  try {
    const { page, limit, search, sortBy, sortOrder, ...filters } = req.query;
    const offers = await offerService.getAllOffers({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filters,
    });
    res.json(offers);
  } catch (error) {
    console.error('Error al obtener las ofertas:', error);
    res.status(500).json({ message: 'Error al obtener las ofertas' });
  }
};

export const getActive = async (req, res) => {
  try {
    const offers = await offerService.getActiveOffers();
    res.json(offers);
  } catch (error) {
    console.error('Error al obtener ofertas activas:', error);
    res.status(500).json({ message: 'Error al obtener ofertas activas' });
  }
};

export const getById = async (req, res) => {
  try {
    const offer = await offerService.getOfferById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(offer);
  } catch (error) {
    console.error('Error al obtener la oferta:', error);
    res.status(500).json({ message: 'Error al obtener la oferta' });
  }
};

export const create = async (req, res) => {
  try {
    const newOffer = await offerService.createOffer(req.body);
    res.status(201).json(newOffer);
  } catch (error) {
    console.error('Error al crear la oferta:', error);
    res.status(500).json({ message: 'Error al crear la oferta' });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await offerService.updateOffer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar la oferta:', error);
    res.status(500).json({ message: 'Error al actualizar la oferta' });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await offerService.deleteOffer(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json({ message: 'Oferta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la oferta:', error);
    res.status(500).json({ message: 'Error al eliminar la oferta' });
  }
};
