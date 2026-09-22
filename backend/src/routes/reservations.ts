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

    // Persist to DB first. If DB save fails, return error to client.
    let reservation: any = null;
    try {
      reservation = await Reservation.create(payload);
    } catch (dbErr: any) {
      console.error('DB save failed for reservation:', dbErr?.message || dbErr);
      return response.status(500).json({ message: 'Failed to save reservation. Please try again later.' });
    }

    // After successful DB save, send notification email (async but errors reported server-side only)
    sendReservationNotification(reservation)
      .then(() => {
        console.log('[BACKEND EMAIL] Reservation email sent for id=', reservation._id || reservation.id);
      })
      .catch((err) => {
        // Log error without exposing SMTP_PASS
        console.error('[BACKEND EMAIL] Reservation email failed:', err?.message || err);
      });

    response.status(201).json({
      message: 'Reservation created',
      reservation,
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
