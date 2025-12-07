// api/qris.js

const { QRISGenerator, PaymentChecker } = require('autoft-qris');

// Ambil config dari ENV (di-set di Vercel dashboard)
const ORKUT_AUTH_USERNAME = process.env.ORKUT_AUTH_USERNAME;
const ORKUT_AUTH_TOKEN = process.env.ORKUT_AUTH_TOKEN;
const BASE_QR_STRING = process.env.BASE_QR_STRING;

// Inisialisasi QRIS generator
// TANPA tema, TANPA logo, cuma baseQrString
const qrisGen = new QRISGenerator({
  baseQrString: BASE_QR_STRING,
});

// Inisialisasi payment checker (OrderKuota)
const paymentChecker = new PaymentChecker({
  auth_token: ORKUT_AUTH_TOKEN,
  auth_username: ORKUT_AUTH_USERNAME,
});

// Handler Vercel
module.exports = async (req, res) => {
  const { method, query } = req;
  const mode = query.mode; // "generate" atau "status"

  // Health check simple
  if (method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'QRIS API OK',
      mode_hint: 'POST /api/qris?mode=generate atau mode=status',
    });
    return;
  }

  if (method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed. Gunakan POST.',
    });
    return;
  }

  if (!mode) {
    res.status(400).json({
      success: false,
      message: 'Query ?mode=generate atau ?mode=status wajib diisi.',
    });
    return;
  }

  try {
    const body = req.body || {};

    // --- MODE: GENERATE QRIS ---
    if (mode === 'generate') {
      const amount = Number(body.amount);
      const reference = body.reference || `REF-${Date.now()}`;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'amount harus > 0',
        });
        return;
      }

      // Generate QR STRING (bukan gambar)
      const qrString = qrisGen.generateQrString(amount);

      res.status(200).json({
        success: true,
        data: {
          reference,
          amount,
          qrString,
        },
      });
      return;
    }

    // --- MODE: CEK STATUS PEMBAYARAN ---
    if (mode === 'status') {
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

      // result biasanya sudah punya format { success, data: { status, ... } }
      res.status(200).json(result);
      return;
    }

    // --- MODE TIDAK DIKENAL ---
    res.status(400).json({
      success: false,
      message: 'mode tidak dikenal. Gunakan mode=generate atau mode=status',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
