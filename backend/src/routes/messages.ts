import { Router } from 'express';
import { z } from 'zod';
import { Message } from '../models/Message';
import { sendMessageNotification } from '../services/email';

const messageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const messagesRouter = Router();

messagesRouter.post('/', async (req, res, next) => {
  try {
    const payload = messageSchema.parse(req.body);
    const message = await Message.create(payload);

    // Send email notification asynchronously
    sendMessageNotification(payload).catch((err) => {
      console.error('Non-blocking backend message email error:', err);
    });

    res.status(201).json({ message: 'Message saved', messageRecord: message });
  } catch (error) {
    next(error);
  }
});

messagesRouter.get('/', async (_req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200);
    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

messagesRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await Message.findByIdAndUpdate(id, req.body, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Updated', messageRecord: msg });
  } catch (error) {
    next(error);
  }
});

messagesRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await Message.findByIdAndDelete(id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
});
