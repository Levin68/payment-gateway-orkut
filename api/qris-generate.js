// api/qris-generate.js

let initError = null;
let qrisGen = null;

try {
  const { QRISGenerator } = require('autoft-qris');

  const config = {
    storeName: 'NEVERMORE OK1331927',
    auth_username: 'vinzyy',
    auth_token: '1331927:cCVk0A4be8WL2ONriangdHJvU7utmfTh',
    baseQrString:
      '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214503370116723410303UMI51440014ID.CO.QRIS.WWW0215ID20232921353400303UMI5204541153033605802ID5919NEVERMORE OK13319276013JAKARTA UTARA61051411062070703A0163046C64',
    // logoPath boleh dikosongin, kita nggak pakai gambar
    // logoPath: './logo.png'
  };

  qrisGen = new QRISGenerator(config, 'theme1');
} catch (err) {
  // SIMPAN error init supaya bisa dikirim ke client
  console.error('INIT ERROR:', err);
  initError = err;
}

module.exports = (req, res) => {
  // Kalau init gagal (misal: modul nggak ketemu, versi Node, dll)
  if (initError) {
    res.status(500).json({
      success: false,
      message: 'INIT_ERROR',
      error: String(initError.message || initError),
      stack: initError.stack || null,
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed. Gunakan POST.',
    });
    return;
  }

  try {
    const body = req.body || {};
    const amount = Number(body.amount);
    const reference = body.reference || `REF-${Date.now()}`;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'amount harus > 0',
      });
      return;
    }

    const qrString = qrisGen.generateQrString(amount);

    res.status(200).json({
      success: true,
      data: {
        reference,
        amount,
        qrString,
      },
    });
  } catch (err) {
    console.error('RUN ERROR /api/qris-generate:', err);
    res.status(500).json({
      success: false,
      message: 'RUN_ERROR',
      error: String(err.message || err),
      stack: err.stack || null,
    });
  }
};
