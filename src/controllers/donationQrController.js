// src/controllers/donationQrController.js
const QRCode = require("qrcode");
const { buildQrPayload } = require("../utils/buildQrPayload");

async function getDonationQr(req, res, next) {
  try {
    const payload = process.env.BASE_URL + "/donate";


    // Return a PNG image
    const pngBuffer = await QRCode.toBuffer(payload, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 10, // higher = better for printing
    });

    res.setHeader("Content-Type", "image/png");

    console.log("QR Payload:\n", payload);

    return res.status(200).send(pngBuffer);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getDonationQr };
