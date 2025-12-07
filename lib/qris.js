// lib/qris.js

const { QRISGenerator, PaymentChecker } = require('autoft-qris');

// CONFIG manual dulu (karena kamu minta manual, bukan env)
const config = {
  storeName: 'NEVERMORE OK1331927',  // bebas, cuma buat identitas toko
  auth_username: 'vinzyy',
  auth_token: '1331927:cCVk0A4be8WL2ONriangdHJvU7utmfTh',
  baseQrString:
    '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214503370116723410303UMI51440014ID.CO.QRIS.WWW0215ID20232921353400303UMI5204541153033605802ID5919NEVERMORE OK13319276013JAKARTA UTARA61051411062070703A0163046C64',
  // logoPath optional, kita nggak pakai generate gambar jadi boleh kosong
  // logoPath: './logo.png'
};

// QRIS generator – tema default ('theme1'), tapi kita cuma pakai qrString
const qrisGen = new QRISGenerator(config, 'theme1');

// Payment checker – buat cek status & saldo
const paymentChecker = new PaymentChecker({
  auth_token: config.auth_token,
  auth_username: config.auth_username,
});

module.exports = {
  qrisGen,
  paymentChecker,
};
