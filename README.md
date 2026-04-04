# Finance Companion 

A modern, role-based personal finance dashboard UI built with **Angular (standalone components)**, **TypeScript**, **Tailwind CSS**, and charts to visualize income, expenses, trends, and transactions.

> Note: This is primarily a frontend/demo app with mock data and a simulated login flow (no backend required).

---


## Features

### Dashboard
- Summary cards (income, expense, balance, transaction count)
- Trend charts + category breakdown
- Unified period filter: **Week / Month / Year**

### Transactions
- **Admin**: create / edit / delete transactions
- **Viewer**: read-only mode
- Export transactions to **CSV** and **JSON**

### Insights
- Insights/analytics view
- Optional API integration via environment configuration

### Role-Based Access Control (RBAC)
- Guarded routes + role checks
- Clear visual indicators for role state

### UI / UX
- Glassmorphism-inspired UI
- Particle canvas background
- Responsive (desktop + mobile)
- Dark/Light mode using CSS variables

---

## Tech Stack

- **Angular** (standalone components)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js**
- **RxJS**

---

## Routes

The app uses an auth guard with role metadata:

- `/login`
- `/dashboard` (guarded: admin, viewer)
- `/transactions` (guarded: admin, viewer)
- `/insights` (guarded: admin, viewer)

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Install
```bash
npm install
```

### Run (development)
```bash
npm start
```

Open the URL printed in the terminal 

### Build
```bash
npm run build
```

### Tests
```bash
npm test
```

---

## Configuration

### Insights API (optional)

You can configure a backend endpoint for insights payloads:

- File: `src/environments/environment.ts`
- Key: `insightsApiUrl`

If left empty, the app uses bundled mock data for demos.

---

## Project Structure (High Level)

- `src/app/`
  - `dashboard.component.*`
  - `transaction.component.*`
  - `insights.component.*`
  - `login/`
  - `services/` (mock data, RBAC, helpers)
- `public/` (static assets)

---

## Notes

- Authentication and roles are **frontend-simulated** for demonstration.
- Transaction data is **generated locally** (sample data).

---

## License

MIT — see `LICENSE`.
