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
    // Notif à toi
    await resend.emails.send({
      from: 'Magistra <onboarding@resend.dev>',
      to: 'juanrobin89@gmail.com',
      subject: '🎓 Nouvelle inscription Magistra',
      html: `<p>Nouvel inscrit sur la waitlist : <strong>${email}</strong></p>`,
    });

    // Email de confirmation à l'inscrit
    await resend.emails.send({
      from: 'Magistra <onboarding@resend.dev>',
      to: email,
      subject: 'Vous êtes sur la liste Magistra ✦',
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:2rem;color:#0f0e0c;">
          <h1 style="font-size:2rem;font-weight:300;margin-bottom:1rem;">Bienvenue sur Magistra.</h1>
          <p style="color:#7a7468;line-height:1.7;">
            Merci pour votre inscription. Vous serez parmi les premiers enseignants à accéder à Magistra dès son lancement.
          </p>
          <p style="color:#7a7468;line-height:1.7;margin-top:1rem;">
            En attendant, découvrez <a href="https://futurai.space" style="color:#c9a84c;">FutureAI</a>, le projet derrière Magistra.
          </p>
          <p style="margin-top:2rem;font-style:italic;color:#c9a84c;">— L'équipe Magistra</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
