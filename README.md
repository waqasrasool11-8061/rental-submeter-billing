# ⚡ Rental Sub-Meter & Automated Billing Portal (رینٹل سب میٹر اینڈ بلنگ مینیجر)

A modern, responsive, mobile-friendly Web Application designed for Pakistani residential rental properties with dual rotating WAPDA meters and tenant electricity sub-meters.

## 🚀 Live Demo & Hosting
* **Live Web Portal:** [https://waqasrasool11-8061.github.io/rental-submeter-billing/](https://waqasrasool11-8061.github.io/rental-submeter-billing/)
* **GitHub Repository:** [https://github.com/waqasrasool11-8061/rental-submeter-billing](https://github.com/waqasrasool11-8061/rental-submeter-billing)

---

## 🌟 Key Features

1. **Dual WAPDA Rotating Meters Formula:**
   * Calculates dynamic blended rate across 2 alternating WAPDA electricity meters (15 days rotation each):
     $$\text{Combined Unit Rate} = \frac{\text{Meter 1 Bill} + \text{Meter 2 Bill}}{\text{Meter 1 Units} + \text{Meter 2 Units}}$$
   * WAPDA Reference 1: `18143170401500`
   * WAPDA Reference 2: `18143170401550`

2. **Tenant Sub-Meter Tracking (احسان اللہ - Meter # 0027710):**
   * Sub-meter consumption is automatically calculated:
     $$\text{Sub-meter Units} = \text{Current Reading} - \text{Previous Reading}$$
     $$\text{Electric Bill} = \text{Units} \times \text{Average WAPDA Unit Rate}$$
   * Formatted in strict **English Left-to-Right (LTR)** to eliminate RTL number/math inversion glitches.

3. **Monthly Utilities Breakdown:**
   * **Water Bill (WASA 1/3 Share):** Customizable & editable.
   * **Sui Gas Bill (1/3 Share):** Customizable & editable.
   * **Electric Motor / Maintenance:** Rs. 300.
   * **House Rent:** Rs. 9,000.
   * **Internet:** Rs. 1,500.
   * **Custom Deductions:** e.g., "گندم پسوائی" (- Rs. 400).

4. **Advance Tracking Ledger:**
   * Initial advance pool: Rs. 50,000 (September 2026).
   * Monthly adjustments tracked automatically (Aug: 10k, Sep: 10k, Oct: 10k -> Balance: Rs. 20,000).
   * Archived cycles support for past settled agreements.

5. **Camera & Photo Evidence:**
   * Integrated camera photo capture for WAPDA Meter 1, Meter 2, WASA bill, Sui Gas bill, and Sub-meter physical reading with full-screen image viewer.

6. **Role-Based Authentication:**
   * **Admin Mode (ایڈمن اکاؤنٹ):** Protected by PIN `23221`. Full edit, save & lock, ledger adjustments, and delete capabilities.
   * **Tenant Mode (کرائے دار اکاؤنٹ - احسان اللہ):** Protected by PIN `0027710`. Read-only, printable receipt view, and direct WhatsApp contact to Admin (`03465118061`).

7. **Wide Responsive Layout:**
   * Balanced multi-column dashboard on wide desktop monitors (`max-w-7xl`).
   * Touch-friendly, fully responsive single-column layout on mobile devices.
   * One-click PDF printing & WhatsApp invoice sharing.

---

## 🛠️ Local Running

```bash
# Clone the repository
git clone https://github.com/waqasrasool11-8061/rental-submeter-billing.git

# Navigate to project folder
cd rental-submeter-billing

# Run with Node.js
npm start
# or
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.
