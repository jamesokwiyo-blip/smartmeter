# Commits: 13-Digit Meter, 20-Digit Token, and Automatic Token Transmission

This document lists where **13-digit meter ID**, **20-digit token**, and **automatic token transmission to the API** were implemented across the repo.

---

## 1. ESP32 (meter ID 13 digits, token 20 digits, automatic token)

### **6a38aff** – feat: Complete dashboard data integration and energy calculation fixes  
**Author:** YUMVUHORE · **Date:** 2026-02-14 09:15

- **13-digit meter:** `METER_NUMBER = "0215002079873"` and usage in API calls.
- **20-digit token:** Input buffer 20 digits, validation “Must be 20 digits”, auto-submit when 20 digits entered.
- **Automatic token delivery:** `checkForPendingToken()` added; ESP32 polls `GET /api/purchases/pending-token/:meterNumber` every 10s and applies pending token when found.
- **Docs:** AUTOMATIC_TOKEN_DELIVERY.md, TOKEN_CHECKING_IMPROVEMENTS.md, etc.

**Relevant files:** `src/main.cpp`, many `.md` docs.

---

## 2. Backend API (13-digit meter, 20-digit token, pending-token endpoint)

### **dbbd35c** – feat: Dashboard data integration and calculation fixes  
**Author:** YUMVUHORE · **Date:** 2026-02-14 09:18

- Adds **server** (root): `server/routes/purchases.js`, `server/database.js`, EnergyData, Purchase (with `tokenApplied`), auth, password reset.
- **Pending-token** and token-delivery support in backend (e.g. `getPendingTokenForMeter`, `confirmTokenApplied`).
- **13-digit meter** and **20-digit token** enforced in purchase flow and DB.

**Relevant files:** `server/database.js`, `server/routes/purchases.js`, `server/routes/auth.js`, `server/routes/energyData.js`, `server/models/*`, and root `src/` frontend.

---

### **496095e** – Update meter token to 20-digit numbers and update gitignore  
**Author:** ezo250 · **Date:** 2026-02-14 18:20

- **20-digit token:** Explicit update to generate and expect 20-digit token numbers in `server/routes/purchases.js`.

**Relevant files:** `server/routes/purchases.js`, `.gitignore`.

---

### **930995d** – Add backend features: ESP32 integration, password reset, token delivery system  
**Author:** ezo250 · **Date:** 2026-02-14 18:38

- **13-digit meter:** Validation in purchases: `meterNumber must be exactly 13 digits` (`/^\d{13}$/`), normalized with `meterStr`.
- **20-digit token:** `generateTokenAndCode()` updated to 20-digit numeric-only token (crypto.randomBytes).
- **Automatic token delivery (API):**  
  - `GET /api/purchases/pending-token/:meterNumber` (or equivalent) and logic for pending token.  
  - `getPendingTokenForMeter`, `confirmTokenApplied` (or equivalent) in DB/routes.  
  - Purchase model: `tokenApplied`, `tokenAppliedAt`.

**Relevant files:** `server/routes/purchases.js`, `server/database.js`, `server/routes/auth.js`, `server/routes/energyData.js`, `server/models/EnergyData.js`, `server/models/Purchase.js`, `server/models/User.js`, `server/index.js`.

---

## 3. Later commits (20-digit validation and docs)

- **7f4037d** – Enhance token generation with validation and documentation for 20-digit numeric format  
- **8b70b59** – Merge remote changes and enhance token generation with 20-digit numeric format  
- **a8ab6b5** – Add token generation test script  
- **50084ec** – Integrate password reset and energy data features into frontend  

These reinforce 20-digit token generation/validation and frontend integration.

---

## Summary table

| Feature                         | Where implemented | Main commits |
|---------------------------------|-------------------|--------------|
| **13-digit meter ID**           | ESP32             | **6a38aff**  |
|                                 | Backend API       | **dbbd35c**, **930995d** |
| **20-digit token**              | ESP32             | **6a38aff**  |
|                                 | Backend API       | **496095e**, **930995d**, 7f4037d, 8b70b59 |
| **Automatic token transmission**| ESP32 (poll + apply) | **6a38aff** (checkForPendingToken) |
|                                 | Backend (pending-token endpoint + DB) | **dbbd35c**, **930995d** |

---

## Order relative to your “restored” stage

- You are currently at **6a38aff** (restored branch): ESP32 already has 13-digit meter, 20-digit token, and automatic token delivery.
- **Next commits** that add the same rules and API support for 13/20 digits and auto token:
  1. **dbbd35c** – Backend + frontend (root server/, src/) with dashboard integration and pending-token support.
  2. **496095e** – Backend: token explicitly 20-digit.
  3. **930995d** – Backend: 13-digit meter validation, 20-digit token generation, and full token delivery system (pending-token API + DB).

To get both ESP32 and backend/frontend with 13-digit meter, 20-digit token, and automatic token transmission, the next commit to move to after 6a38aff is **dbbd35c**, then **496095e** and **930995d** (or a branch that contains them, e.g. after the merge that brought in 930995d).
