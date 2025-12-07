// api/qris-generate.js

const { qrisGen } = require('../lib/qris');

// Vercel Node.js Serverless Function
// Pattern: module.exports = (req, res) => {...} 3
module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed',
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

    // Cuma generate QR STRING, tanpa logo & tema
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
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
