import { Router } from 'express';
import { sendMessageNotification, sendReservationNotification } from '../services/email';

export const debugRouter = Router();

// GET /api/debug/email-test — sends a test message and reservation notification
debugRouter.get('/email-test', async (req, res) => {
  try {
    const messagePayload = {
      name: 'Debug Tester',
      email: process.env.SMTP_USER || 'no-reply@example.com',
      phone: '+0000000000',
      subject: 'Test message from backend',
      message: 'This is a test message to verify SMTP connectivity and delivery.',
    };

    const reservationPayload = {
      fullName: 'Debug Tester',
      email: process.env.SMTP_USER || 'no-reply@example.com',
      phone: '+0000000000',
      checkIn: '2026-10-01',
      checkOut: '2026-10-02',
      guests: 1,
      roomType: 'Debug Room',
      notes: 'Test reservation',
    };

    // fire both notifications (non-blocking) — errors will be logged server-side without exposing secrets
    sendMessageNotification(messagePayload).catch((err: any) => console.error('[DEBUG] sendMessageNotification error:', err?.message || err));
    sendReservationNotification(reservationPayload).catch((err: any) => console.error('[DEBUG] sendReservationNotification error:', err?.message || err));

    res.json({ success: true, message: 'Triggered debug email notifications. Check backend logs and inbox.' });
  } catch (err) {
    console.error('[DEBUG] email-test error:', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});
