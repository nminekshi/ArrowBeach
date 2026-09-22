import nodemailer from 'nodemailer';
import { readCollection } from '@/lib/db';
import { site } from '@/data/site';

export interface BookingNotificationData {
  id?: string;
  customerName?: string;
  fullName?: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number | string;
  roomType: string;
  specialRequests?: string;
  notes?: string;
  createdAt?: string;
}

export interface MessageNotificationData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: string;
}

function getRecipientEmail(): string {
  if (process.env.NOTIFICATION_EMAIL) {
    return process.env.NOTIFICATION_EMAIL;
  }
  try {
    const settings = readCollection('settings');
    if (settings && settings[0]?.email) {
      return settings[0].email;
    }
  } catch {
    // fallback
  }
  return site.email || 'arrowbeachresort@gmail.com';
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send an email notification for a new reservation/booking
 */
export async function sendReservationNotification(data: BookingNotificationData): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const recipient = getRecipientEmail();
  const guestName = data.customerName || data.fullName || 'Guest';
  const guestEmail = data.email || 'Not provided';
  const guestPhone = data.phone || 'Not provided';
  const requests = data.specialRequests || data.notes || 'None';
  const transporter = getTransporter();

  const subject = `🛎️ New Reservation Request: ${guestName} (${data.roomType})`;

  const textContent = `
NEW RESERVATION REQUEST - ARROW BEACH HOTEL
===========================================
Guest Name: ${guestName}
Email: ${guestEmail}
Phone: ${guestPhone}
Room Type: ${data.roomType}
Check-In Date: ${data.checkIn}
Check-Out Date: ${data.checkOut}
Number of Guests: ${data.guests}
Special Requests: ${requests}

Received: ${new Date().toLocaleString()}
Manage reservations in the admin dashboard: /admin/bookings
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #092c3a 0%, #0e4c63 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.85; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 10px; }
    .content { padding: 28px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .info-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-table td.label { font-weight: 600; color: #475569; width: 38%; background-color: #f8fafc; }
    .info-table td.value { color: #0f172a; }
    .notes-box { background: #fdfbf7; border-left: 4px solid #0e4c63; padding: 14px 18px; margin-top: 20px; border-radius: 0 8px 8px 0; }
    .notes-box h4 { margin: 0 0 6px 0; font-size: 13px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
    .notes-box p { margin: 0; font-size: 14px; color: #1e293b; line-height: 1.5; }
    .action { text-align: center; margin-top: 28px; }
    .button { display: inline-block; background: #0e4c63; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Arrow Beach Hotel</h1>
      <p>New Guest Reservation Request</p>
      <span class="badge">🛎️ Booking Pending</span>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin-top: 0;">A new reservation request has been submitted through your website:</p>
      <table class="info-table">
        <tr>
          <td class="label">Guest Name</td>
          <td class="value"><strong>${guestName}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${guestEmail}" style="color: #0369a1; text-decoration: none;">${guestEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp</td>
          <td class="value"><a href="tel:${guestPhone}" style="color: #0369a1; text-decoration: none;">${guestPhone}</a></td>
        </tr>
        <tr>
          <td class="label">Room Category</td>
          <td class="value"><strong>${data.roomType}</strong></td>
        </tr>
        <tr>
          <td class="label">Check-In Date</td>
          <td class="value">${data.checkIn}</td>
        </tr>
        <tr>
          <td class="label">Check-Out Date</td>
          <td class="value">${data.checkOut}</td>
        </tr>
        <tr>
          <td class="label">Total Guests</td>
          <td class="value">${data.guests} person(s)</td>
        </tr>
      </table>

      ${
        requests && requests !== 'None'
          ? `
      <div class="notes-box">
        <h4>Special Requests / Notes</h4>
        <p>${requests}</p>
      </div>`
          : ''
      }

      <div class="action">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/bookings" class="button">View & Manage in Admin Dashboard</a>
      </div>
    </div>
    <div class="footer">
      This notification was automatically sent to <strong>${recipient}</strong> by the Arrow Beach Hotel website system.
    </div>
  </div>
</body>
</html>
`;

  if (!transporter) {
    console.log('\n======================================================');
    console.log('📬 [EMAIL NOTIFICATION - SMTP Credentials Pending]');
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Guest: ${guestName} | Email: ${guestEmail} | Phone: ${guestPhone}`);
    console.log(`Room: ${data.roomType} | Dates: ${data.checkIn} -> ${data.checkOut} | Guests: ${data.guests}`);
    console.log(`Special Requests: ${requests}`);
    console.log('ℹ️ To send live emails to your inbox, set SMTP_USER and SMTP_PASS in .env.local');
    console.log('======================================================\n');
    return { success: true, simulated: true };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      replyTo: guestEmail !== 'Not provided' ? guestEmail : undefined,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`✅ [EMAIL SENT] Reservation notification delivered to ${recipient}`);
    return { success: true };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ [EMAIL ERROR] Failed to send reservation email:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Send an email notification for a new contact form message
 */
export async function sendMessageNotification(data: MessageNotificationData): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const recipient = getRecipientEmail();
  const transporter = getTransporter();

  const senderName = data.name || 'Website Visitor';
  const senderEmail = data.email || 'Not provided';
  const senderPhone = data.phone || 'Not provided';
  const subjectLine = `📬 New Message from ${senderName}: ${data.subject}`;

  const textContent = `
NEW WEBSITE MESSAGE - ARROW BEACH HOTEL
=======================================
From: ${senderName}
Email: ${senderEmail}
Phone: ${senderPhone}
Subject: ${data.subject}

Message:
${data.message}

Received: ${new Date().toLocaleString()}
Manage messages in the admin dashboard: /admin/messages
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #092c3a 0%, #0e4c63 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.85; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 10px; }
    .content { padding: 28px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .info-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-table td.label { font-weight: 600; color: #475569; width: 38%; background-color: #f8fafc; }
    .info-table td.value { color: #0f172a; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; margin-top: 20px; border-radius: 12px; }
    .message-box h4 { margin: 0 0 8px 0; font-size: 13px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
    .message-box p { margin: 0; font-size: 14px; color: #0f172a; line-height: 1.6; white-space: pre-line; }
    .action { text-align: center; margin-top: 28px; }
    .button { display: inline-block; background: #0e4c63; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Arrow Beach Hotel</h1>
      <p>New Website Inquiry</p>
      <span class="badge">💬 New Message</span>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin-top: 0;">You have received a new message through the website contact form:</p>
      <table class="info-table">
        <tr>
          <td class="label">Sender Name</td>
          <td class="value"><strong>${senderName}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${senderEmail}" style="color: #0369a1; text-decoration: none;">${senderEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="value"><a href="tel:${senderPhone}" style="color: #0369a1; text-decoration: none;">${senderPhone}</a></td>
        </tr>
        <tr>
          <td class="label">Subject</td>
          <td class="value"><strong>${data.subject}</strong></td>
        </tr>
      </table>

      <div class="message-box">
        <h4>Message Content</h4>
        <p>${data.message}</p>
      </div>

      <div class="action">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/messages" class="button">View in Admin Dashboard</a>
        <a href="mailto:${senderEmail}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; margin-left: 12px; color: #0e4c63; text-decoration: underline; font-size: 14px;">Reply via Email</a>
      </div>
    </div>
    <div class="footer">
      This notification was automatically sent to <strong>${recipient}</strong> by the Arrow Beach Hotel website system.
    </div>
  </div>
</body>
</html>
`;

  if (!transporter) {
    console.log('\n======================================================');
    console.log('📬 [EMAIL NOTIFICATION - SMTP Credentials Pending]');
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subjectLine}`);
    console.log(`From: ${senderName} (${senderEmail}, ${senderPhone})`);
    console.log(`Topic: ${data.subject}`);
    console.log(`Message: ${data.message}`);
    console.log('ℹ️ To send live emails to your inbox, set SMTP_USER and SMTP_PASS in .env.local');
    console.log('======================================================\n');
    return { success: true, simulated: true };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"Arrow Beach Hotel" <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      replyTo: senderEmail !== 'Not provided' ? senderEmail : undefined,
      subject: subjectLine,
      text: textContent,
      html: htmlContent,
    });
    console.log(`✅ [EMAIL SENT] Message notification delivered to ${recipient}`);
    return { success: true };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ [EMAIL ERROR] Failed to send contact email:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
