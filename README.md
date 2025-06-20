# SportsDunia Multi-Level Referral & Earning System

## Overview

This project implements a robust multi-level referral and earning system with real-time notifications, analytics, and a modern React frontend. Users can refer up to 8 people directly, and profit is distributed across two levels of referrals. The system is designed for scalability, security, and live data updates.

---

## Features

- **Multi-level referral hierarchy** (up to 8 direct referrals per user)
- **Profit sharing:** 5% from direct (Level 1), 1% from indirect (Level 2) referrals
- **Purchase validation:** Only purchases above ₹1000 generate earnings
- **Real-time notifications** for new earnings (Socket.io)
- **Comprehensive analytics** and reports
- **Automatic user inactivation** based on referral activity
- **Edge case handling** (inactive users, referral limits, invalid codes)
- **Modern React frontend** with live updates

---

## System Architecture

### 1. **Backend (Node.js/Express + MongoDB)**
- **Models:** User, Referral, Earning, Purchase
- **Controllers/Services:** Handle registration, login, purchases, earnings, analytics, and real-time events
- **Socket.io:** For live earning notifications
- **Scripts:** Data migration, auto-inactivation, etc.

### 2. **Frontend (React)**
- **Pages:** Dashboard, Login, Register, Analytics
- **Components:** Referral tree, analytics, earnings history, notifications
- **API Layer:** Communicates with backend for all data
- **Socket Hook:** For real-time updates

### 3. **Database**
- **User:** Profile, referral code, referredBy, isActive, etc.
- **Referral:** Tracks direct/indirect referrals
- **Earning:** Tracks all earnings, levels, and purchase references
- **Purchase:** Records all purchases

---

## Setup Instructions

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd sportsdunia
```

### 2. **Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB URI and secrets
npm start
```

### 3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```
- The frontend runs on [http://localhost:3000](http://localhost:3000)
- The backend runs on [http://localhost:5000](http://localhost:5000)

### 4. **Database Migration & Scripts**
- To ensure referral data consistency:
  ```bash
  node backend/scripts/migrateReferrals.js
  ```
- To auto-inactivate users based on referral activity:
  ```bash
  node backend/scripts/markInactiveByReferralActivity.js
  ```

---

## API Usage

### **Authentication**
- **POST /api/auth/register** — Register a new user (optionally with referral code)
- **POST /api/auth/login** — Login and receive JWT

### **User & Referral**
- **GET /api/users/profile** — Get user profile
- **GET /api/users/referrals** — Get referral tree

### **Purchases**
- **POST /api/purchases** — Create a purchase (triggers earnings if valid)

### **Earnings**
- **GET /api/earnings/history** — Get earnings history (with referral info)
- **GET /api/earnings/summary** — Get earnings summary

### **Analytics & Reports**
- **GET /api/reports/earnings-summary** — Earnings overview
- **GET /api/reports/referral-analytics** — Direct/indirect referral analytics
- **GET /api/reports/level-breakdown** — Earnings by level
- **GET /api/reports/earning-sources** — Earnings by referral
- **GET /api/reports/monthly-trend** — Monthly earnings trend

### **Socket.io**
- Connect with JWT token for real-time earning notifications.

---

## System Logic

### **Referral & Earning Flow**
1. **User registers** (optionally with referral code)
2. **User refers others** (up to 8 direct)
3. **Referred user makes a purchase** (> ₹1000)
4. **Direct referrer** gets 5% commission, **indirect referrer** gets 1%
5. **Earnings** are recorded and real-time notifications sent

### **Automatic Inactivation**
- If none of a user's direct referrals make a qualifying purchase in 7 days, the user is marked inactive by the script.

---

## Edge Case Handling

- **Max 8 direct referrals** per user
- **Inactive users** do not receive new earnings or referrals
- **Invalid referral codes** are rejected
- **Purchases below ₹1000** do not generate earnings
- **Data migration** and **auto-inactivation** scripts provided

---

## Security & Privacy

- All APIs require JWT authentication
- Sensitive data (passwords, tokens) never exposed
- Only the logged-in user can access their own analytics and earnings

---

## Extending & Customizing

- **Change commission rates** in `.env`
- **Change inactivity period** in the inactivation script
- **Add more analytics or admin features** as needed

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

---

## License

MIT (or your preferred license)

---

## Questions?

Open an issue or contact the maintainer. 