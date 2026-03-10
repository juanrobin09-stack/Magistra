// api/waitlist.js — Vercel API Route
// Variables d'environnement Vercel :
// - RESEND_API_KEY : clé API Resend
// - GOOGLE_SHEET_URL : URL du Google Apps Script déployé

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
    // Notif mail (obligatoire)
    await resend.emails.send({
      from: 'Magistra <onboarding@resend.dev>',
      to: 'juanrobin89@gmail.com',
      subject: '🎓 Nouvelle inscription Magistra',
      html: `<p>Nouvel inscrit sur la waitlist : <strong>${email}</strong></p>`,
    });

    // Sauvegarde Google Sheets (optionnel, ne bloque pas l'inscription)
    if (process.env.GOOGLE_SHEET_URL) {
      fetch(process.env.GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(err => console.error('Google Sheets error:', err));
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
