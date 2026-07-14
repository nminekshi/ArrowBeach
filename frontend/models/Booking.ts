import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, default: 1 },
    roomType: { type: String, required: true },
    specialRequests: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;
