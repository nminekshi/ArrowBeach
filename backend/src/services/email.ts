import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

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

  const transporter = nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user, pass },
  });

  return transporter;
}

function sendViaSendGrid(mailOptions: { from: string; to: string; subject: string; text: string; replyTo?: string }) {
  const apiKey = process.env.SENDGRID_API_KEY || '';
  if (!apiKey) return null;
  sgMail.setApiKey(apiKey);
  return async () => {
    await sgMail.send({
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      text: mailOptions.text,
      replyTo: mailOptions.replyTo,
    });
  };
}

export async function sendReservationNotification(data: ReservationEmailData) {
  const transporter = getTransporter();
  const subject = `🛎️ New Reservation Request: ${data.fullName} (${data.roomType})`;

  if (!transporter) {
    console.log('\n[BACKEND EMAIL] SMTP credentials pending. Notification for:', NOTIFICATION_EMAIL);
    console.log(`Reservation from: ${data.fullName} (${data.email}, ${data.phone}) - Room: ${data.roomType}`);
    return;
  }

  // Log transporter info (non-sensitive)
  try {
    const info = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: process.env.SMTP_SECURE || (process.env.SMTP_PORT === '465' ? 'true' : 'false'),
      user: process.env.SMTP_USER ? process.env.SMTP_USER.split('@')[0] + '@' + process.env.SMTP_USER.split('@')[1] : undefined,
    };
    console.log('[BACKEND EMAIL] Transporter config:', info);
  } catch (e) {
    console.log('[BACKEND EMAIL] Transporter config log failed');
  }

  // Verify transporter connectivity before sending
  try {
    await transporter.verify();
    console.log('[BACKEND EMAIL] SMTP transporter verified');
  } catch (verifyErr: any) {
    console.error('[BACKEND EMAIL] transporter.verify() failed:', verifyErr?.message || verifyErr);
    // Continue — we still attempt to send and rely on sendMail errors for details
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject,
    text: `New Reservation Request:\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nRoom: ${data.roomType}\nDates: ${data.checkIn} to ${data.checkOut}\nGuests: ${data.guests}\nNotes: ${data.notes || 'None'}`,
  };

  // Try send with simple retry
  const maxAttempts = 3;
  // If SENDGRID_API_KEY is available, prefer SendGrid API
  const sendgridSend = sendViaSendGrid({ from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject, text: mailOptions.text, replyTo: mailOptions.replyTo });
  if (sendgridSend) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await sendgridSend();
        console.log('[BACKEND EMAIL] Delivered reservation email via SendGrid to', NOTIFICATION_EMAIL);
        break;
      } catch (err: any) {
        console.error(`[BACKEND EMAIL] SendGrid send attempt ${attempt} failed:`, err?.message || err);
        if (attempt === maxAttempts) console.error('[BACKEND EMAIL] All SendGrid attempts failed');
        else await new Promise((res) => setTimeout(res, 500 * attempt));
      }
    }
    return;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('[BACKEND EMAIL] Delivered reservation email to', NOTIFICATION_EMAIL, 'resultId=', result.messageId);
      break;
    } catch (err: any) {
      console.error(`[BACKEND EMAIL] sendMail attempt ${attempt} failed:`, err?.message || err);
      if (attempt === maxAttempts) {
        console.error('[BACKEND EMAIL] All send attempts failed');
      } else {
        await new Promise((res) => setTimeout(res, 500 * attempt));
      }
    }
  }
}

export interface MessageEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendMessageNotification(data: MessageEmailData) {
  const transporter = getTransporter();
  const subject = `✉️ New Message: ${data.subject} — ${data.name}`;

  if (!transporter) {
    console.log('\n[BACKEND EMAIL] SMTP credentials pending. Message notification for:', NOTIFICATION_EMAIL);
    console.log(`Message from: ${data.name} (${data.email}, ${data.phone || 'no phone'}) - Subject: ${data.subject}`);
    console.log('Message:', data.message);
    return;
  }

  try {
    await transporter.verify();
    console.log('[BACKEND EMAIL] SMTP transporter verified for message');
  } catch (verifyErr: any) {
    console.error('[BACKEND EMAIL] transporter.verify() failed for message:', verifyErr?.message || verifyErr);
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject,
    text: `New Message from ${data.name} <${data.email}>\nPhone: ${data.phone || 'N/A'}\nSubject: ${data.subject}\n\n${data.message}`,
  };

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('[BACKEND EMAIL] Delivered message email to', NOTIFICATION_EMAIL, 'resultId=', result.messageId);
      break;
    } catch (err: any) {
      console.error(`[BACKEND EMAIL] sendMail attempt ${attempt} failed for message:`, err?.message || err);
      if (attempt === maxAttempts) {
        console.error('[BACKEND EMAIL] All send attempts failed for message');
      } else {
        await new Promise((res) => setTimeout(res, 500 * attempt));
      }
    }
  }
}
