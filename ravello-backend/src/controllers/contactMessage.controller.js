import { contactService } from '../services/index.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await contactService.getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const msg = await contactService.createMessage(req.body);
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const msg = await contactService.markAsRead(req.params.id);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await contactService.deleteMessage(req.params.id);
    res.json({ message: 'Mensaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
