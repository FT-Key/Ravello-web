import { ContactMessage } from '../models/index.js';

export const getAllMessages = async () => {
  return await ContactMessage.find().sort({ createdAt: -1 });
};

export const createMessage = async (data) => {
  const message = new ContactMessage(data);
  return await message.save();
};

export const markAsRead = async (id) => {
  return await ContactMessage.findByIdAndUpdate(id, { leido: true }, { new: true });
};

export const deleteMessage = async (id) => {
  return await ContactMessage.findByIdAndDelete(id);
};
