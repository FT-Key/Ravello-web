import { offerService } from '../services/index.js';

export const getAll = async (req, res) => {
  try {
    const offers = await offerService.getAllOffers();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getActive = async (req, res) => {
  try {
    const offers = await offerService.getActiveOffers();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getById = async (req, res) => {
  try {
    const offer = await offerService.getOfferById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const create = async (req, res) => {
  try {
    const newOffer = await offerService.createOffer(req.body);
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export const update = async (req, res) => {
  try {
    const updated = await offerService.updateOffer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export const remove = async (req, res) => {
  try {
    const deleted = await offerService.deleteOffer(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.json({ message: 'Oferta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}