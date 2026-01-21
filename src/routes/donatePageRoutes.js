const express = require("express");
const router = express.Router();

router.get("/donate", (req, res) => {
  const bankName = process.env.DONATION_BANK_NAME || "";
  const accountNumber = process.env.DONATION_ACCOUNT_NUMBER || "";
  const accountName = process.env.DONATION_ACCOUNT_NAME || "";
  const narration = process.env.DONATION_NARRATION || "";

  const html = `
    <html>
      <head>
        <title>Donation Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f8f8f8;
            color: #333;
          }
          .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 400px;
            margin: auto;
            box-shadow: 0 3px 12px rgba(0,0,0,0.1);
          }
          h2 {
            text-align: center;
            color: #111;
          }
          .item {
            margin: 10px 0;
            padding: 10px;
            background: #fafafa;
            border-radius: 5px;
            font-size: 16px;
          }
          button {
            width: 100%;
            margin-top: 15px;
            padding: 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Donation Account Details</h2>
          <div class="item"><strong>Bank:</strong> ${bankName}</div>
          <div class="item"><strong>Account Number:</strong> ${accountNumber}</div>
          <div class="item"><strong>Account Name:</strong> ${accountName}</div>
          ${narration ? `<div class="item"><strong>Narration:</strong> ${narration}</div>` : ""}
        </div>
      </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;
