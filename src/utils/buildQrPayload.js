// src/utils/buildQrPayload.js

function buildQrPayload() {
  const bankName = process.env.DONATION_BANK_NAME || "";
  const accountNumber = process.env.DONATION_ACCOUNT_NUMBER || "";
  const accountName = process.env.DONATION_ACCOUNT_NAME || "";
  const narration = process.env.DONATION_NARRATION || "";

  // Keep it clean and readable for all scanners
  const lines = [
    `Bank: ${bankName}`,
    `Account Number: ${accountNumber}`,
    `Account Name: ${accountName}`,
  ];

  if (narration.trim()) {
    lines.push(`Narration: ${narration.trim()}`);
  }

  return lines.join("\n");
}

module.exports = { buildQrPayload };
