// lib/qris.js
const { QRISGenerator, PaymentChecker } = require('autoft-qris');

// Config dari environment Vercel
const config = {
  baseQrString: process.env.BASE_QR_STRING,
  auth_username: process.env.ORKUT_AUTH_USERNAME,
  auth_token: process.env.ORKUT_AUTH_TOKEN,
};

// QRIS generator
// ❗ Tidak pakai logoPath, tidak pakai tema (theme), dan tidak generate image.
// Kita cuma pakai generateQrString saja.
const qrisGen = new QRISGenerator({
  baseQrString: config.baseQrString,
});

// Payment checker untuk API OrderKuota
const paymentChecker = new PaymentChecker({
  auth_token: config.auth_token,
  auth_username: config.auth_username,
});

module.exports = {
  qrisGen,
  paymentChecker,
};
