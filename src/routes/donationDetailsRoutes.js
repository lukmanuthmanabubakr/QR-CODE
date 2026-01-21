// src/routes/donationDetailsRoutes.js
const express = require("express");
const { getDonationDetails } = require("../controllers/donationDetailsController");

const router = express.Router();

router.get("/donation-details", getDonationDetails);

module.exports = router;
