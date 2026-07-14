import mongoose, { Schema, model, models } from 'mongoose';

const SettingSchema = new Schema(
  {
    name: { type: String, default: 'Arrow Beach Hotel' },
    description: { type: String },
    tagline: { type: String },
    location: { type: String },
    phone: { type: String },
    phoneDisplay: { type: String },
    email: { type: String },
    address: { type: String },
    whatsapp: { type: String },
    mapQuery: { type: String },
  },
  { timestamps: true }
);

const Setting = models.Setting || model('Setting', SettingSchema);

export default Setting;
