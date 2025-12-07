// api/qris-generate.js

const { qrisGen } = require('../lib/qris');

module.exports = (req, res) => {
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

    // generate *string* QRIS saja
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
    console.error('ERROR /api/qris-generate:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
