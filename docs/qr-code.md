# Secure QR-Based Donation Backend Guide (Node.js – JavaScript)

This document explains **how to build a secure backend first** for a QR-based donation / fundraising system using **Node.js (JavaScript, not TypeScript)**.

The focus of this guide is **security**. The system is designed so that **no outsider, admin, or attacker can change the destination account number or hijack funds**.

---

## 1. Core Security Principle (Read This First)

> **The client must NEVER control where money goes.**

All sensitive payment details (bank account, merchant ID, provider keys) must live **only on the backend**.

The QR code and frontend **must never contain editable bank details**.

---

## 2. What the Backend Is Allowed to Do

The backend is responsible for:

* Creating donation intents
* Locking the recipient account permanently
* Generating immutable payment references
* Returning a payment URL
* Verifying payment webhooks
* Updating payment status

The backend **does NOT**:

* Accept bank account numbers from users
* Trust frontend-submitted payment details
* Complete transfers automatically

---

## 3. High-Level Secure Flow

1. Admin creates a campaign (one-time setup)
2. Backend stores the campaign’s bank details securely
3. User requests to donate
4. Backend creates a donation intent
5. Backend generates a payment link using stored bank details
6. QR code encodes only the payment URL
7. User confirms payment in bank app
8. Payment provider sends webhook
9. Backend verifies and updates status

---

## 4. Technology Stack

* Node.js
* Express.js
* MongoDB or PostgreSQL
* Payment provider: Paystack / Flutterwave
* Environment variables for secrets

---

## 5. Project Structure (Recommended)

```
src/
 ├─ controllers/
 ├─ routes/
 ├─ services/
 ├─ models/
 ├─ webhooks/
 ├─ middlewares/
 ├─ utils/
 ├─ app.js
 └─ server.js
```

Keep it simple and auditable.

---

## 6. Database Models (Security-Focused)

### Campaign (Immutable Bank Details)

```js
{
  _id,
  name,
  description,
  paymentProvider,
  providerAccountId, // stored once, never edited via public API
  isActive,
  createdAt
}
```

**Important rules:**

* `providerAccountId` is set **once**
* No public endpoint updates this field
* Changes require manual admin action

---

### Donation

```js
{
  _id,
  campaignId,
  amount,
  currency,
  reference,
  status, // pending | success | failed
  providerResponse,
  createdAt
}
```

---

## 7. Step 1: Create Donation Intent (Critical Endpoint)

### Route

```
POST /api/donations
```

### Request Body (Minimal)

```json
{
  "campaignId": "abc123",
  "amount": 5000
}
```

### Backend Validation Steps

1. Validate campaign exists and is active
2. Validate amount (min/max)
3. Fetch campaign bank details from DB
4. Generate unique reference
5. Save donation with `pending` status
6. Generate payment link using stored account

**The client never sends bank details.**

---

## 8. Secure Reference Generation

```js
function generateReference() {
  return `DON-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
```

Rules:

* Generated only on backend
* Stored before payment initiation
* Used to match webhook events

---

## 9. Payment Service Layer (Isolation)

Create a service file:

```js
// services/paymentService.js
async function createPaymentLink({ amount, reference, campaign }) {
  // Uses campaign.providerAccountId
  // Calls Paystack / Flutterwave API
  // Returns hosted payment URL
}

module.exports = { createPaymentLink };
```

Controllers must **never** talk directly to providers.

---

## 10. QR Code Security Rule

The QR code must encode **ONLY**:

```
https://yourdomain.com/pay/{donationId}
```

It must NOT contain:

* Account numbers
* Amounts
* Provider IDs
* Bank names

All sensitive data is fetched server-side.

---

## 11. Webhook Handling (High Security)

### Route

```
POST /api/webhooks/payment
```

### Mandatory Checks

* Verify provider signature
* Match reference with stored donation
* Confirm amount matches
* Update status once (idempotent)

```js
if (donation.status !== 'pending') return;
```

Never trust webhook payload blindly.

---

## 12. Protection Against Fund Hijacking

To prevent outsiders from changing account numbers:

* No public API updates campaign payment details
* Campaign payment data stored server-side only
* Environment variables for provider keys
* Role-based admin access
* Audit logs for admin actions

---

## 13. Environment Variable Usage

```
PAYSTACK_SECRET_KEY=sk_live_xxx
FLUTTERWAVE_SECRET_KEY=flw_live_xxx
```

Never expose these to frontend.

---

## 14. Backend Is Complete When

* Bank details are never sent from client
* Payment links are generated server-side
* Webhooks are verified
* References are immutable
* Donation status cannot be replayed

---

## 15. Final Engineering Rule

> If a user can change the destination account from the frontend, the system is broken.

Security over convenience. Always.

---

Next steps if needed:

* Real Paystack JavaScript integration
* Admin authentication design
* Rate limiting & abuse prevention
* Production deployment checklist

Say what you want to add next.
