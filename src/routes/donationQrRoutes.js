const express = require("express");
const { getDonationQr } = require("../controllers/donationQrController");

const router = express.Router();

router.get("/donation-qr", getDonationQr);

module.exports = router;
