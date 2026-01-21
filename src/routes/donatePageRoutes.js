const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Serve logo image
router.get("/donate/logo", (req, res) => {
  const logoPath = path.join(__dirname, "..", "assets", "mssn-logo.png");
  
  if (fs.existsSync(logoPath)) {
    res.sendFile(logoPath);
  } else {
    res.status(404).send("Logo not found");
  }
});

router.get("/donate", (req, res) => {
  const bankName = process.env.DONATION_BANK_NAME || "";
  const accountNumber = process.env.DONATION_ACCOUNT_NUMBER || "";
  const accountName = process.env.DONATION_ACCOUNT_NAME || "";
  const narration = process.env.DONATION_NARRATION || "";

  const brandName = "MSSN FUTA Branch";
  // Use route-based logo serving as fallback
  const logoUrl = process.env.BRAND_LOGO_URL || "";

  const missing =
    !bankName.trim() || !accountNumber.trim() || !accountName.trim();

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#6a1b9a" />
  <title>${esc(brandName)} | Donation Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #6a1b9a;
      --secondary: #ffd600;
      --deep-blue: #003366;
      --light-blue: #0097a7;
      --bg: #ffffff;
      --card-bg: #f9f7fc;
      --text: #212121;
      --text-muted: #4a4a4a;
      --border: rgba(106, 27, 154, 0.12);
      --shadow: 0 4px 20px rgba(106, 27, 154, 0.08);
      --shadow-hover: 0 8px 30px rgba(106, 27, 154, 0.15);
      --radius: 12px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      max-width: 580px;
      margin: 0 auto;
      padding: 32px 20px 48px;
      flex: 1;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-top: 20px;
    }

    .logo-container {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      border-radius: 20px;
      background: linear-gradient(135deg, #f9f7fc 0%, #f3e5f5 100%);
      border: 2px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow);
      overflow: hidden;
      position: relative;
    }

    .logo-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8px;
    }

    .logo-placeholder {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary), var(--light-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--deep-blue);
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .main-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }

    .main-card:hover {
      box-shadow: var(--shadow-hover);
    }

    .card-header {
      background: linear-gradient(135deg, var(--primary), #5b1685);
      padding: 24px 20px;
      text-align: center;
      color: white;
    }

    .card-header h2 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .card-header p {
      font-size: 13px;
      opacity: 0.9;
      font-weight: 500;
    }

    .card-body {
      padding: 24px 20px;
    }

    ${missing ? `
    .warning {
      margin-bottom: 20px;
      padding: 16px;
      background: rgba(255, 193, 7, 0.1);
      border-left: 4px solid #ffc107;
      border-radius: 8px;
      font-size: 13px;
      color: #6a4b00;
      font-weight: 600;
    }` : ""}

    .detail-group {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-item {
      background: white;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
    }

    .detail-item:hover {
      border-color: var(--primary);
      background: linear-gradient(135deg, #f9f7fc 0%, #ffffff 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(106, 27, 154, 0.1);
    }

    .detail-item:active {
      transform: translateY(0);
    }

    .detail-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .copy-hint {
      font-size: 11px;
      color: var(--primary);
      font-weight: 600;
    }

    .detail-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      word-break: break-word;
      user-select: none;
    }

    .actions {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    .btn {
      width: 100%;
      padding: 16px 20px;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Montserrat', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), #5b1685);
      color: white;
      box-shadow: 0 4px 14px rgba(106, 27, 154, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(106, 27, 154, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .instruction {
      margin-top: 20px;
      padding: 16px;
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      border-radius: 10px;
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
      font-weight: 500;
      border-left: 3px solid var(--secondary);
    }

    .footer {
      text-align: center;
      padding: 24px 20px;
      color: var(--text-muted);
      font-size: 13px;
    }

    .footer-brand {
      font-weight: 700;
      color: var(--primary);
    }

    .toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%) translateY(100px);
      background: linear-gradient(135deg, var(--deep-blue), var(--primary));
      color: white;
      padding: 14px 24px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 700;
      display: none;
      max-width: calc(100% - 40px);
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideUp 0.3s ease forwards;
    }

    .toast.show {
      display: block;
    }

    @keyframes slideUp {
      to {
        transform: translateX(-50%) translateY(0);
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 24px 16px 40px;
      }

      .brand-title {
        font-size: 24px;
      }

      .logo-container {
        width: 90px;
        height: 90px;
      }

      .detail-value {
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo-container">
        ${logoUrl 
          ? `<img src="${esc(logoUrl)}" alt="${esc(brandName)} Logo" />` 
          : `<span class="logo-placeholder">MF</span>`
        }
      </div>
      <h1 class="brand-title">${esc(brandName)}</h1>
      <p class="brand-subtitle">Secure Donation Portal</p>
    </header>

    <div class="main-card">
      <div class="card-header">
        <h2>Bank Transfer Details</h2>
        <p>Tap any field to copy instantly</p>
      </div>

      <div class="card-body">
        ${missing ? `<div class="warning">⚠️ Configuration incomplete. Please contact the administrator to set up donation details.</div>` : ""}

        <div class="detail-group">
          <div class="detail-item" data-copy="${esc(bankName)}" data-label="Bank Name">
            <div class="detail-label">
              <span>Bank Name</span>
              <span class="copy-hint">Tap to copy</span>
            </div>
            <div class="detail-value">${esc(bankName || "Not configured")}</div>
          </div>

          <div class="detail-item" data-copy="${esc(accountNumber)}" data-label="Account Number">
            <div class="detail-label">
              <span>Account Number</span>
              <span class="copy-hint">Tap to copy</span>
            </div>
            <div class="detail-value">${esc(accountNumber || "Not configured")}</div>
          </div>

          <div class="detail-item" data-copy="${esc(accountName)}" data-label="Account Name">
            <div class="detail-label">
              <span>Account Name</span>
              <span class="copy-hint">Tap to copy</span>
            </div>
            <div class="detail-value">${esc(accountName || "Not configured")}</div>
          </div>

          ${narration && narration.trim()
            ? `<div class="detail-item" data-copy="${esc(narration.trim())}" data-label="Narration">
                <div class="detail-label">
                  <span>Narration</span>
                  <span class="copy-hint">Tap to copy</span>
                </div>
                <div class="detail-value">${esc(narration.trim())}</div>
              </div>`
            : ""}
        </div>

        <div class="actions">
          <button class="btn btn-primary" id="copyAll">Copy All Details</button>
        </div>

        <div class="instruction">
          <strong>Instructions:</strong> After copying the details, open your banking app, select transfer, paste the account number, enter your donation amount, and complete the transaction.
        </div>
      </div>
    </div>

    <footer class="footer">
      <p>Powered by <span class="footer-brand">${esc(brandName)}</span></p>
    </footer>
  </div>

  <div class="toast" id="toast">Copied successfully</div>

  <script>
    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(text) {
      toast.textContent = text;
      toast.classList.add("show");
      
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 2000);
    }

    async function copyText(text) {
      if (!text || !text.trim()) {
        showToast("Nothing to copy");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          const success = document.execCommand("copy");
          document.body.removeChild(textarea);
          return success;
        } catch (err) {
          return false;
        }
      }
    }

    document.querySelectorAll(".detail-item").forEach(item => {
      item.addEventListener("click", async (e) => {
        e.preventDefault();
        const value = item.getAttribute("data-copy");
        const label = item.getAttribute("data-label");
        
        if (!value || value === "Not configured") {
          showToast("Nothing to copy");
          return;
        }
        
        const success = await copyText(value);
        if (success) {
          showToast(label + " copied!");
        } else {
          showToast("Failed to copy");
        }
      });
    });

    document.getElementById("copyAll").addEventListener("click", async (e) => {
      e.preventDefault();
      const details = [];
      
      document.querySelectorAll(".detail-item").forEach(item => {
        const value = item.getAttribute("data-copy");
        const label = item.getAttribute("data-label");
        
        if (value && value.trim() && value !== "Not configured") {
          details.push(label.toUpperCase() + ": " + value);
        }
      });

      if (details.length === 0) {
        showToast("No details to copy");
        return;
      }

      const text = details.join("\\n");
      const success = await copyText(text);
      if (success) {
        showToast("All details copied!");
      } else {
        showToast("Failed to copy");
      }
    });
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

module.exports = router;