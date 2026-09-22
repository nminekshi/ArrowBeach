import { Router } from 'express';
import { z } from 'zod';
import { Reservation } from '../models/Reservation';
import { sendReservationNotification } from '../services/email';

const reservationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  checkIn: z.string().min(4),
  checkOut: z.string().min(4),
  guests: z.coerce.number().int().min(1),
  roomType: z.string().min(2),
  notes: z.string().optional(),
});

export const reservationsRouter = Router();

reservationsRouter.post('/', async (request, response, next) => {
  try {
    const payload = reservationSchema.parse(request.body);

    // Try to persist to DB, but fall back gracefully if DB is unreachable
    let reservation: any = null;
    let savedToDb = false;
    try {
      reservation = await Reservation.create(payload);
      savedToDb = true;
    } catch (dbErr) {
      console.error('DB save failed for reservation, continuing without DB:', dbErr?.message || dbErr);
      reservation = { ...payload, id: `fallback-${Date.now()}`, createdAt: new Date().toISOString() };
    }

    // Trigger email notification asynchronously (non-blocking)
    sendReservationNotification(payload).catch((err) => {
      console.error('Non-blocking backend email error:', err);
    });

    response.status(201).json({
      message: 'Reservation request received',
      reservation,
      savedToDb,
    });
  } catch (error) {
    next(error);
  }
});

reservationsRouter.get('/', async (_request, response, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 }).limit(50);
    response.json({ reservations });
  } catch (error) {
    next(error);
  }
});

reservationsRouter.put('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;
    const reservation = await Reservation.findByIdAndUpdate(id, request.body, { new: true });
    if (!reservation) {
      response.status(404).json({ message: 'Reservation not found' });
      return;
    }
    response.json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
    next(error);
  }
});

reservationsRouter.delete('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      response.status(404).json({ message: 'Reservation not found' });
      return;
    }
    response.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
});
