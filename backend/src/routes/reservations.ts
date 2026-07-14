import { Router } from 'express';
import { z } from 'zod';
import { Reservation } from '../models/Reservation';

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
    const reservation = await Reservation.create(payload);

    response.status(201).json({
      message: 'Reservation request saved successfully',
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
