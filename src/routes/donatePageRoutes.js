const express = require("express");
const router = express.Router();

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

router.get("/donate", (req, res) => {
  const bankName = process.env.DONATION_BANK_NAME || "";
  const accountNumber = process.env.DONATION_ACCOUNT_NUMBER || "";
  const accountName = process.env.DONATION_ACCOUNT_NAME || "";
  const narration = process.env.DONATION_NARRATION || "";

  const brandName = process.env.BRAND_NAME || "Donation";
  const primary = process.env.BRAND_PRIMARY || "#1AAE55";
  const bg = process.env.BRAND_BG || "#F4F7F6";
  const logoUrl = process.env.BRAND_LOGO_URL || "";
  const heroUrl = process.env.BRAND_HERO_URL || "";

  // Basic guard: if you forgot env values, still show something clear
  const missing =
    !bankName.trim() || !accountNumber.trim() || !accountName.trim();

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="${esc(primary)}" />
  <title>${esc(brandName)} Donations</title>
  <style>
    :root{
      --primary:${esc(primary)};
      --bg:${esc(bg)};
      --card:#ffffff;
      --text:#102A26;
      --muted:#5C6F6B;
      --border:rgba(16,42,38,.10);
      --shadow:0 10px 30px rgba(16,42,38,.10);
      --radius:18px;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    .wrap{
      max-width: 520px;
      margin: 0 auto;
      padding: 18px 16px 28px;
    }
    .top{
      display:flex;
      align-items:center;
      gap:12px;
      margin-top: 6px;
      margin-bottom: 14px;
    }
    .logo{
      width:44px;height:44px;
      border-radius: 12px;
      background: #fff;
      display:flex;align-items:center;justify-content:center;
      box-shadow: 0 6px 18px rgba(0,0,0,.06);
      overflow:hidden;
      flex: 0 0 auto;
    }
    .logo img{width:100%;height:100%;object-fit:contain}
    .brand{
      line-height:1.1;
    }
    .brand .name{
      font-weight: 800;
      letter-spacing: .2px;
      font-size: 16px;
      margin:0;
    }
    .brand .sub{
      margin:4px 0 0;
      color: var(--muted);
      font-size: 13px;
    }
    .hero{
      margin: 10px 0 14px;
      border-radius: var(--radius);
      overflow: hidden;
      background: #e9efed;
      box-shadow: var(--shadow);
    }
    .hero img{
      width:100%;
      height: 160px;
      display:block;
      object-fit: cover;
    }
    .card{
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 16px;
      border: 1px solid var(--border);
    }
    .title{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:10px;
      margin-bottom: 12px;
    }
    .title h1{
      margin:0;
      font-size: 18px;
      font-weight: 900;
    }
    .pill{
      background: rgba(26,174,85,.12);
      color: var(--primary);
      border: 1px solid rgba(26,174,85,.25);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
    .info{
      display:flex;
      flex-direction:column;
      gap:10px;
    }
    .row{
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      background: #fbfdfc;
    }
    .label{
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 4px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
    }
    .valueBtn{
      width:100%;
      text-align:left;
      background: transparent;
      border: none;
      padding: 0;
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
      cursor: pointer;
      line-height: 1.25;
      word-break: break-word;
    }
    .valueBtn:active{opacity:.7}
    .hint{
      margin-top: 12px;
      font-size: 13px;
      color: var(--muted);
      line-height: 1.45;
    }
    .actions{
      margin-top: 14px;
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }
    .btn{
      flex: 1 1 180px;
      border: none;
      border-radius: 14px;
      padding: 12px 14px;
      font-weight: 800;
      cursor:pointer;
      box-shadow: 0 8px 18px rgba(16,42,38,.10);
    }
    .btnPrimary{
      background: var(--primary);
      color: white;
    }
    .btnGhost{
      background: #ffffff;
      border: 1px solid var(--border);
      color: var(--text);
    }
    .toast{
      position: fixed;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      background: rgba(16,42,38,.92);
      color: #fff;
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      display:none;
      max-width: calc(100% - 24px);
      text-align:center;
    }
    .warn{
      margin-top: 12px;
      padding: 12px;
      border-radius: 14px;
      background: rgba(255,193,7,.12);
      border: 1px solid rgba(255,193,7,.25);
      color: #6a4b00;
      font-size: 13px;
      line-height: 1.45;
      font-weight: 650;
    }
    @media (max-width: 360px){
      .hero img{height:140px}
      .valueBtn{font-size:15px}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="logo" aria-label="Logo">
        ${logoUrl ? `<img src="${esc(logoUrl)}" alt="${esc(brandName)} logo" />` : `<span style="font-weight:900;color:var(--primary)">${esc(brandName).slice(0,2)}</span>`}
      </div>
      <div class="brand">
        <p class="name">${esc(brandName)} Donations</p>
        <p class="sub">Tap any field to copy. Then transfer in your bank app.</p>
      </div>
    </div>

    ${heroUrl ? `<div class="hero"><img src="${esc(heroUrl)}" alt="${esc(brandName)}" /></div>` : ""}

    <div class="card">
      <div class="title">
        <h1>Donation Account</h1>
        <span class="pill">Secure • Manual Transfer</span>
      </div>

      ${missing ? `<div class="warn">Some donation details are missing on the server. Check your .env values and redeploy.</div>` : ""}

      <div class="info">
        <div class="row">
          <div class="label">
            <span>Bank Name</span>
            <span>Tap to copy</span>
          </div>
          <button class="valueBtn" type="button" data-copy="${esc(bankName)}">${esc(bankName || "-")}</button>
        </div>

        <div class="row">
          <div class="label">
            <span>Account Number</span>
            <span>Tap to copy</span>
          </div>
          <button class="valueBtn" type="button" data-copy="${esc(accountNumber)}">${esc(accountNumber || "-")}</button>
        </div>

        <div class="row">
          <div class="label">
            <span>Account Name</span>
            <span>Tap to copy</span>
          </div>
          <button class="valueBtn" type="button" data-copy="${esc(accountName)}">${esc(accountName || "-")}</button>
        </div>

        ${narration && narration.trim()
          ? `<div class="row">
              <div class="label">
                <span>Narration</span>
                <span>Tap to copy</span>
              </div>
              <button class="valueBtn" type="button" data-copy="${esc(narration.trim())}">${esc(narration.trim())}</button>
            </div>`
          : ""}
      </div>

      <div class="actions">
        <button class="btn btnPrimary" type="button" id="copyAll">Copy All Details</button>
        <button class="btn btnGhost" type="button" id="share">Share</button>
      </div>

      <div class="hint">
        After copying, open your bank app, paste the account number, enter the amount, and confirm the transfer.
      </div>
    </div>
  </div>

  <div class="toast" id="toast">Copied</div>

  <script>
    const toast = document.getElementById("toast");

    function showToast(text) {
      toast.textContent = text;
      toast.style.display = "block";
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => {
        toast.style.display = "none";
      }, 1600);
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // Fallback for older browsers
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          return true;
        } catch (err) {
          return false;
        }
      }
    }

    document.querySelectorAll("[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy") || "";
        if (!value.trim()) return showToast("Nothing to copy");
        const ok = await copyText(value);
        showToast(ok ? "Copied" : "Copy failed");
      });
    });

    document.getElementById("copyAll").addEventListener("click", async () => {
      const lines = [];
      document.querySelectorAll("[data-copy]").forEach(el => {
        const v = (el.getAttribute("data-copy") || "").trim();
        if (v) lines.push(v);
      });
      const text = lines.join("\\n");
      const ok = await copyText(text);
      showToast(ok ? "All copied" : "Copy failed");
    });

    document.getElementById("share").addEventListener("click", async () => {
      const parts = [];
      document.querySelectorAll("[data-copy]").forEach(el => {
        const v = (el.getAttribute("data-copy") || "").trim();
        if (v) parts.push(v);
      });
      const text = parts.join("\\n");

      if (navigator.share) {
        try {
          await navigator.share({ title: "Donation Details", text });
        } catch (e) {}
      } else {
        const ok = await copyText(text);
        showToast(ok ? "Copied to share" : "Copy failed");
      }
    });
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

module.exports = router;
