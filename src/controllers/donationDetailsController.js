// src/controllers/donationDetailsController.js

function getDonationDetails(req, res) {
  const bankName = process.env.DONATION_BANK_NAME;
  const accountNumber = process.env.DONATION_ACCOUNT_NUMBER;
  const accountName = process.env.DONATION_ACCOUNT_NAME;
  const narration = process.env.DONATION_NARRATION || "";

  return res.status(200).json({
    success: true,
    data: {
      bankName,
      accountNumber,
      accountName,
      narration,
    },
  });
}

module.exports = { getDonationDetails };
