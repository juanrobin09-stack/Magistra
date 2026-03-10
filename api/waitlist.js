// api/waitlist.js — Vercel API Route
// Installe Resend : npm install resend
// Ajoute RESEND_API_KEY dans tes variables d'environnement Vercel

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  try {
    // Notif à toi uniquement
    await resend.emails.send({
      from: 'Magistra <onboarding@resend.dev>',
      to: 'juanrobin89@gmail.com',
      subject: '🎓 Nouvelle inscription Magistra',
      html: `<p>Nouvel inscrit sur la waitlist : <strong>${email}</strong></p>`,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
