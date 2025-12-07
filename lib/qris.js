// lib/qris.js
import { QRISGenerator, PaymentChecker } from 'autoft-qris';

const config = {
  storeName: 'NEVERMORE OK1331927',
  auth_username: 'vinzyy',
  auth_token: '1331927:cCVk0A4be8WL2ONriangdHJvU7utmfTh',
  baseQrString:
    '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214503370116723410303UMI51440014ID.CO.QRIS.WWW0215ID20232921353400303UMI5204541153033605802ID5919NEVERMORE OK13319276013JAKARTA UTARA61051411062070703A0163046C64',
  // logoPath optional, kita gak pakai gambar
  // logoPath: './logo.png'
};

// Generator QRIS – kita nanti cuma ambil qrString-nya
export const qrisGen = new QRISGenerator(config, 'theme1');

// Payment checker – cek status pembayaran
export const paymentChecker = new PaymentChecker({
  auth_token: config.auth_token,
  auth_username: config.auth_username,
});
