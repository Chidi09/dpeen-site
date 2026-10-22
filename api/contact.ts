import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { enquirySchema, formatEnquiry } from '../src/lib/enquiry.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }
  const origin = req.headers.origin;
  try {
    if (origin && new URL(origin).host !== req.headers.host)
      return res.status(403).json({ error: 'Invalid origin.' });
  } catch {
    return res.status(403).json({ error: 'Invalid origin.' });
  }
  if (!req.headers['content-type']?.startsWith('application/json'))
    return res.status(415).json({ error: 'Use JSON.' });
  if (JSON.stringify(req.body ?? {}).length > 12000)
    return res.status(413).json({ error: 'Message too large.' });
  if (typeof req.body?.website === 'string' && req.body.website)
    return res.status(400).json({ error: 'Invalid submission.' });
  const result = enquirySchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: 'Please check your details.' });
  const user = process.env.SMTP_USER || 'info@dpeenetwork.com';
  const pass = process.env.SMTP_PASSWORD;
  if (!pass)
    return res.status(503).json({ error: 'Email delivery is unavailable.' });
  const transport = nodemailer.createTransport({
    host: 'smtp.purelymail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    const delivery = await transport.sendMail({
      from: { name: 'DPEEN website', address: user },
      to: 'info@dpeenetwork.com',
      replyTo: result.data.email,
      subject: `Website enquiry: ${result.data.interest}`,
      text: formatEnquiry(result.data),
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    if (!delivery.accepted.length) throw new Error('Recipient not accepted');
    return res.status(200).json({ sent: true });
  } catch {
    return res
      .status(502)
      .json({ error: 'Your message could not be sent. Please try again.' });
  } finally {
    transport.close();
  }
}
