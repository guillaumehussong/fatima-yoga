const nodemailer = require('nodemailer');
require('dotenv').config();  // Charger les variables d'environnement

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Afficher les informations SMTP dans la console
console.log('SMTP Config:', {
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_PORT === '465',
  user: process.env.EMAIL_SERVER_USER,
});

// Envoyer un e-mail de test
transporter.sendMail({
  from: `"Guillaume" <${process.env.EMAIL_FROM}>`,
  to: process.env.SEED_EMAILS_ADMIN, // Utilisez votre e-mail admin comme destinataire
  subject: "Test Email",
  text: "Ceci est un email de test pour vérifier la configuration SMTP.",
}, (error, info) => {
  if (error) {
    console.log('Erreur d\'envoi d\'email:', error);
  } else {
    console.log('E-mail envoyé:', info.response);
  }
});