import nodemailer from 'nodemailer';

export interface ReservationEmailData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  notes?: string;
}

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'arrowbeachresort@gmail.com';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user, pass },
  });
}

export async function sendReservationNotification(data: ReservationEmailData) {
  const transporter = getTransporter();
  const subject = `🛎️ New Reservation Request: ${data.fullName} (${data.roomType})`;

  if (!transporter) {
    console.log('\n[BACKEND EMAIL] SMTP credentials pending. Notification for:', NOTIFICATION_EMAIL);
    console.log(`Reservation from: ${data.fullName} (${data.email}, ${data.phone}) - Room: ${data.roomType}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: data.email,
      subject,
      text: `New Reservation Request:\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nRoom: ${data.roomType}\nDates: ${data.checkIn} to ${data.checkOut}\nGuests: ${data.guests}\nNotes: ${data.notes || 'None'}`,
    });
    console.log('[BACKEND EMAIL] Delivered reservation email to', NOTIFICATION_EMAIL);
  } catch (err: any) {
    console.error('[BACKEND EMAIL ERROR]', err?.message || err);
  }
}
