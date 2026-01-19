# Static Donation QR Backend Guide (Node.js – JavaScript)

This document explains **the simplest and safest** way to build a donation QR solution for a mosque/charity.

✅ **What you are building**

* A **static QR code** that contains the donation bank details as **plain text**.
* When people scan it, they **see the bank name, account number, and account name**.
* They then open their bank app and **transfer manually** (amount + PIN/OTP).

❌ **What you are NOT building**

* No bank app integration
* No automatic transfers
* No collecting credentials
* No payment provider needed
* No website required

This approach is reliable, works offline after you print the QR, and cannot “crash” when many people scan it, because scanning does not hit your server.

---

## 1. Target User Experience

1. Mosque prints the QR code on posters / flyers
2. Donor scans the QR code
3. Donor sees:

   * Bank name
   * Account number
   * Account name
   * Optional narration/reference suggestion
4. Donor copies the account number (or memorises it) and sends money in their bank app

That’s it.

---

## 2. Core Security Principle

> The QR code must contain only **public donation details**, never secrets.

Allowed inside QR:

* Bank name
* Account number
* Account name
* Optional “Narration: RAMADAN DONATION”

Never inside QR:

* Paystack/Flutterwave keys
* Admin tokens
* Personal donor data
* Anything that can be abused

---

## 3. Why This Works for Everyone

* Every phone can scan a QR and display text
* No dependency on bank deep links
* No dependency on Paystack/Flutterwave
* No dependency on internet

**Important:** This does not auto-open bank apps. It simply makes it easy for donors to get the correct bank details without typing.

---

## 4. Minimal Backend Responsibilities

The backend is only needed to:

* Store donation account details (optional)
* Generate the QR code image (PNG)
* Serve the QR for download/printing

After you generate the QR once, you can print it and you are done.

---

## 5. Recommended Project Structure

```
src/
 ├─ controllers/
 ├─ routes/
 ├─ services/
 ├─ utils/
 ├─ app.js
 └─ server.js
```

You do **not** need models/webhooks for the static QR MVP.

---

## 6. Environment Variables (.env)

If you want the bank details stored in env (simple MVP):

```
PORT=5000
NODE_ENV=development

DONATION_BANK_NAME=GTBank
DONATION_ACCOUNT_NUMBER=0123456789
DONATION_ACCOUNT_NAME=MSSN Mosque Donations
DONATION_NARRATION=RAMADAN DONATION
```

Security note:

* These are not secrets like API keys, but still treat them as configuration.
* Keep `.env` out of GitHub.

---

## 7. QR Payload Format (Plain Text)

Your QR should encode a clean text block like:

```
Bank: GTBank
Account Number: 0123456789
Account Name: MSSN Mosque Donations
Narration: RAMADAN DONATION
```

Tips:

* Keep it short and readable
* Use consistent labels
* Avoid emojis in the QR payload (some scanners display them weirdly)

---

## 8. Endpoints (Backend Only)

### A) Get donation details (optional)

* `GET /api/donation-details`
* Returns the details as JSON

### B) Generate / download the QR code

* `GET /api/donation-qr`
* Returns a PNG image

You can also generate the QR once and save it as a file for printing.

---

## 9. Reliability (Why It Won’t Crash)

* Once printed, scanning happens on the user’s phone
* No request is made to your server during scanning (because QR contains text)
* Your server is only used when you generate or download the QR

So even if 10,000 people scan the same printed QR, nothing will crash.

---

## 10. Final Checklist

* [ ] Bank details confirmed and correct
* [ ] QR payload is readable
* [ ] QR generated in high resolution (print-friendly)
* [ ] QR tested with multiple phones (Android + iPhone)
* [ ] Poster includes a short instruction: “Scan to get account details”

---

## 11. Next Step

If you want, we can add:

* Multiple accounts (different banks) in one QR payload
* Separate QR per campaign (Ramadan / Zakat / Building Fund)
* A tiny admin-protected endpoint to update donation details (optional)

Tell me what you want next.
