// api/qris-status.js

const { paymentChecker } = require('../lib/qris');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed',
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

    // call API OrderKuota via PaymentChecker (autoft-qris)
    const result = await paymentChecker.checkPaymentStatus(reference, amount);
    // result biasanya bentuknya { success: true, data: { status: 'PAID' | 'UNPAID' | ... } }

    res.status(200).json(result); // langsung pass-through biar sama dengan lib
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
