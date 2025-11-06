import { Offer } from '../models/index.js';

export const getAllOffers = async () => {
  return await Offer.find().populate('package');
}

export const getActiveOffers = async () => {
  const today = new Date();
  return await Offer.find({
    activo: true,
    fechaInicio: { $lte: today },
    fechaFin: { $gte: today },
  }).populate('package');
}

export const getOfferById = async (id) => {
  return await Offer.findById(id).populate('package');
}

export const createOffer = async (data) => {
  const offer = new Offer(data);
  return await offer.save();
}

export const updateOffer = async (id, data) => {
  return await Offer.findByIdAndUpdate(id, data, { new: true });
}

export const deleteOffer = async (id) => {
  return await Offer.findByIdAndDelete(id);
}
