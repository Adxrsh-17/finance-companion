# Finance Companion (Zorvyn)

A modern, role-based personal finance dashboard built with **Angular (standalone components)**, **TypeScript**, **Tailwind CSS**, and charting for quick insights into income/expenses, trends, and transaction history.

> This project is a frontend UI with mock/sample data and a simulated auth flow (no real backend required).

## Demo Credentials

Use the built-in mock accounts on the login screen:

- **Admin**: `admin@zorvyn.com` / `admin123`
- **Viewer**: `viewer@zorvyn.com` / `viewer123`

## Features

- **Dashboard**
  - Summary cards (income, expense, balance, etc.)
  - Trend charts and category breakdown
  - Time-period filtering (Week / Month / Year)
- **Transactions**
  - Admin: create / edit / delete transactions
  - Viewer: read-only access
  - Export to **CSV** and **JSON**
- **Insights**
  - Insights view for additional analytics
  - Optional API hook via environment config
- **Role-based access control (RBAC)**
  - Protected routes with role checks
  - Clear UI indicators for role
- **Theme system**
  - Dark / light mode using CSS variables
  - Smooth transitions
- **Premium UI**
  - Glassmorphism styling
  - Particle canvas background
  - Responsive layout

## Tech Stack

- **Angular** (standalone components)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js**
- **RxJS**

## Routes

The app uses Angular router with an auth guard:

- `/login`
- `/dashboard` (guarded: admin, viewer)
- `/transactions` (guarded: admin, viewer)
- `/insights` (guarded: admin, viewer)

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (repo uses npm; see `package.json`)

### Install

```bash
npm install
```

### Run (dev)

```bash
npm start
```

Then open the URL shown in your terminal (typically `http://localhost:4200`).

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Configuration

### Insights API (optional)

You can configure an optional backend endpoint to receive insight payloads:

- File: `src/environments/environment.ts`
- Key: `insightsApiUrl`

If left empty, the app uses bundled public mock JSON for demos.

## Project Structure (high level)

- `src/app/` — main app code
  - `dashboard.component.*`
  - `transaction.component.*`
  - `insights.component.*`
  - `login/`
  - `services/` (mock data + RBAC + helpers)
- `public/` — static assets

## Notes

- Auth & roles are **simulated on the frontend** for demo purposes.
- Transaction data is generated locally (sample data).

## License

MIT — see [`LICENSE`](LICENSE).