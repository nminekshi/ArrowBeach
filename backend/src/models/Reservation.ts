import { Schema, model, models } from 'mongoose';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface ReservationDocument {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<ReservationDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    roomType: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true },
);

export const Reservation = models.Reservation || model<ReservationDocument>('Reservation', reservationSchema);
