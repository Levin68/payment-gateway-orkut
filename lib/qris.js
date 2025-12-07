// api/qris.js

const { QRISGenerator, PaymentChecker } = require('autoft-qris');

// ================= CONFIG MANUAL =================
const ORKUT_AUTH_USERNAME = "vinzyy"; // username akun Orkut / OrderKuota
const ORKUT_AUTH_TOKEN    = "1331927:cCVk0A4be8WL2ONriangdHJvU7utmfTh"; // token hasil verify
const BASE_QR_STRING      = "00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214503370116723410303UMI51440014ID.CO.QRIS.WWW0215ID20232921353400303UMI5204541153033605802ID5919NEVERMORE OK13319276013JAKARTA UTARA61051411062070703A0163046C64";
// ==================================================

// Generator QRIS – TANPA tema, TANPA logo, cuma pakai baseQrString
const qrisGen = new QRISGenerator({
  baseQrString: BASE_QR_STRING,
});

// Payment checker ke API OrderKuota
const paymentChecker = new PaymentChecker({
  auth_token: ORKUT_AUTH_TOKEN,
  auth_username: ORKUT_AUTH_USERNAME,
});

// Handler Vercel
module.exports = async (req, res) => {
  const { method, query } = req;
  const mode = query.mode; // "generate" atau "status"

  // Health check
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

    // ========== GENERATE QRIS ==========
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

      // Generate QR STRING (bukan gambar, gak pake tema/logo)
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

    // ========== CEK STATUS PEMBAYARAN ==========
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

      // Langsung balikin hasil dari library
      res.status(200).json(result);
      return;
    }

    // Mode lain selain generate/status
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
