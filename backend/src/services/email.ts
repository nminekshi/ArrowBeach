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

export interface MessageEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'arrowbeachresort@gmail.com';

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
}

function getTransporter() {
  const cfg = getSmtpConfig();
  if (!cfg.auth.user || !cfg.auth.pass) return null;
  return nodemailer.createTransport(cfg);
}

async function sendMail(mailOptions: nodemailer.SendMailOptions) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('SMTP credentials not configured on server');
  }

  // Verify transporter (does not expose password)
  try {
    await transporter.verify();
    console.log('[BACKEND EMAIL] SMTP transporter verified');
  } catch (err: any) {
    console.error('[BACKEND EMAIL] transporter.verify() failed:', err?.message || err);
    // Let send attempt proceed; sendMail will likely fail if verify failed
  }

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('[BACKEND EMAIL] Email sent to %s messageId=%s', mailOptions.to, (info && info.messageId) || 'unknown');
      return info;
    } catch (err: any) {
      console.error('[BACKEND EMAIL] sendMail attempt %d failed: %s', attempt, err?.message || err);
      if (attempt === maxAttempts) throw err;
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
}

export async function sendReservationNotification(data: ReservationEmailData) {
  const subject = `🛎️ New Reservation Request: ${data.fullName} (${data.roomType})`;
  const text = `New Reservation Request:\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nRoom: ${data.roomType}\nDates: ${data.checkIn} to ${data.checkOut}\nGuests: ${data.guests}\nNotes: ${data.notes || 'None'}`;

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject,
    text,
  };

  return sendMail(mailOptions);
}

export async function sendMessageNotification(data: MessageEmailData) {
  const subject = `✉️ New Message: ${data.subject} — ${data.name}`;
  const text = `New Message from ${data.name} <${data.email}>\nPhone: ${data.phone || 'N/A'}\nSubject: ${data.subject}\n\n${data.message}`;

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject,
    text,
  };

  return sendMail(mailOptions);
}
