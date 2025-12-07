// api/qris-status.js

const { paymentChecker } = require('../lib/qris');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed. Gunakan POST.',
    });
    return;
  }

  try {
    const body = req.body || {};
    const reference = body.reference;
    const amount = Number(body.amount);

    if (!reference) {
      res.status(400).json({
        success: false,
        message: 'reference wajib diisi',
      });
      return;
    }

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'amount harus > 0',
      });
      return;
    }

    const result = await paymentChecker.checkPaymentStatus(reference, amount);

    res.status(200).json(result);
  } catch (err) {
    console.error('ERROR /api/qris-status:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
