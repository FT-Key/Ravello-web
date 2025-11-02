import express from 'express';
import { contactController } from '../controllers/index.js';

const router = express.Router();

router.get('/', contactController.getMessages);
router.post('/', contactController.createMessage);
router.put('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.deleteMessage);

export default router;
