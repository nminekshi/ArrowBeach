import mongoose, { Schema, model, models } from 'mongoose';

const RoomSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: String, required: true },
    breakfast: { type: String },
    description: { type: String, required: true },
    amenities: { type: [String], default: [] },
    fullAmenities: { type: [String], default: [] },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Room = models.Room || model('Room', RoomSchema);

export default Room;
