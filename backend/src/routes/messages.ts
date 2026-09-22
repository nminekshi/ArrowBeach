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

    // Persist message to DB first. If DB save fails, return error to client.
    let messageRecord: any = null;
    try {
      messageRecord = await Message.create(payload);
    } catch (dbErr: any) {
      console.error('DB save failed for message:', dbErr?.message || dbErr);
      return res.status(500).json({ message: 'Failed to save message. Please try again later.' });
    }

    // After DB save, notify via email (async)
    sendMessageNotification(messageRecord)
      .then(() => {
        console.log('[BACKEND EMAIL] Message email sent for id=', messageRecord._id || messageRecord.id);
      })
      .catch((err) => {
        console.error('[BACKEND EMAIL] Message email failed:', err?.message || err);
      });

    res.status(201).json({ message: 'Message saved', messageRecord });
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
