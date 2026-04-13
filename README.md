<div align="center">

# 💰 Finance Companion

### A full-featured personal finance dashboard built with Angular 21

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org)
[![Netlify](https://img.shields.io/badge/Netlify-Live-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://agent-69d1f4cecf84307613c--finance-companion-app.netlify.app/login)

**[🔗 Live Demo]([https://agent-69d1f4cecf84307613c--finance-companion-app.netlify.app/login](https://wealthgridapp.netlify.app/login))** &nbsp;|&nbsp; **[⬡ GitHub Repository](https://github.com/Adxrsh-17/finance-companion)**

*Adarsh Pradeep · ads.vibgyor.17@gmail.com*

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
  - [Dashboard Overview](#1-dashboard-overview)
  - [Transactions](#2-transactions)
  - [Role-Based UI (RBAC)](#3-role-based-ui-rbac)
  - [Insights](#4-insights)
  - [Admin Settings](#5-admin-settings-panel)
  - [Dark Mode & PWA](#6-dark-mode--pwa)
- [Project Structure](#-project-structure)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [Getting Started](#-getting-started)
- [Using the Application](#-using-the-application)
- [Data Model](#-data-model)
- [Edge Case Handling](#-edge-case-handling)
- [Optional Enhancements Implemented](#-optional-enhancements-implemented)

---

## 🧭 Project Overview

Finance Companion is a responsive single-page application (SPA) that lets users track income, expenses, and financial health through an intuitive, chart-driven interface. Built entirely on the frontend with no backend dependency, it uses a mock dataset seeded into `localStorage` to simulate real-world financial data.

The application is structured around three main views:

| Page | Purpose |
|---|---|
| **Dashboard** | At-a-glance summary cards, balance trend, and spending breakdown charts |
| **Transactions** | Full transaction list with search, filter, sort, and CRUD (Admin only) |
| **Insights** | AI-style financial analysis — health score, smart actions, budget deviation, and more |

All three pages are gated behind a lightweight authentication flow, and the UI changes meaningfully depending on whether the logged-in user is an **Admin** or a **Viewer**.

> **No backend or database is required.** All data is seeded from a mock dataset and persisted in `localStorage`, making the app fully self-contained and ready to run offline as a PWA.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Angular 21 (standalone components, Signals API) | Core SPA framework |
| Styling | Tailwind CSS v3 + custom CSS | Utility-first responsive design |
| Charts | Chart.js v4 | Line, bar, and doughnut visualisations |
| Date utilities | date-fns v4 | Date range arithmetic and formatting |
| Primary State | Angular Signals (`FinanceStateService`) | Reactive, fine-grained state management |
| Auxiliary State | Zustand v5 | Secondary store demonstration |
| CSV export | PapaParse v5 | Client-side CSV serialisation |
| Build tooling | Angular CLI v21, esbuild, Vitest | Fast builds and unit testing |
| Deployment | Netlify + `netlify.toml` | SPA-aware redirect rules |
| PWA | Angular Service Worker + Web App Manifest | Offline support and install-to-homescreen |

---

## ✨ Features

### 1. Dashboard Overview

- **Summary cards** — Total Balance, Income, Expenses, and Net Savings — each with a period-over-period percentage change badge (green for improvement, red for decline).
- **Balance Trend chart** — Line chart showing the running balance over the selected reporting period.
- **Income vs. Expense chart** — Grouped bar chart bucketed by day (≤14 days) or by week (longer ranges) — automatically adapts to the time window.
- **Spending Breakdown chart** — Doughnut chart showing the expense share per category with colour coding.
- **Time range selector** — Switch between `7 Days`, `Month`, `Year`, or a fully custom month/year picker. All cards and charts update reactively with zero page reload.

---

### 2. Transactions

- Paginated table showing date, category, type (income/expense), amount, and an optional note.
- **Real-time search** — Full-text search across category, note, and amount fields simultaneously.
- **Compound filters** — Dropdown filters for category and transaction type (`All / Income / Expense`).
- **Sortable columns** — Click any column header to sort by date, amount, or category. Click again to toggle ascending/descending.
- **Date scope toggle** — View transactions for the active reporting period only, or switch to all-time view.
- **Export** — Download the full dataset as **CSV** or **JSON** with one click.
- **Reset** — Revert to the original mock dataset at any time.

**Admin-only controls (hidden from Viewers):**

- Add new transactions via a form modal
- Edit existing transactions inline
- Delete transactions with a confirmation prompt

---

### 3. Role-Based UI (RBAC)

Two roles are supported. Roles can be selected at login or switched instantly from the navigation bar — no page reload required.

| Role | What They Can Do |
|---|---|
| **Viewer** | Read-only access to Dashboard, Transactions, and Insights. All write controls and Admin Settings are hidden. |
| **Admin** | Full CRUD on transactions, access to Admin Settings (algorithm constants + simulation modifiers), and the What-If scenario tool. |

**Implementation details:**

- The custom `[appHasRole]` **structural directive** conditionally renders template blocks based on the current role. It subscribes to the reactive `role$` observable, so the UI updates the moment the role changes.
- `RoleService` exposes `role$`, `isAdmin$`, and `isViewer$` as RxJS observables. Any component can consume them via `async` pipe or `toSignal()`.
- Role and auth state are persisted to `localStorage` and survive page refreshes. A `storage` event listener keeps the role in sync across multiple tabs.

```html
<!-- Example: button only visible to admins, using the structural directive -->
<button *appHasRole="'admin'" (click)="addTransaction()">
  + Add Transaction
</button>
```

---

### 4. Insights

The Insights page generates a rich, data-driven narrative from the current period's transactions:

| Insight | Description |
|---|---|
| **Financial Health Score** | Composite score (0–100) based on savings rate, net cash flow, and zero-spend streak. Rated Excellent / Good / Fair / Needs Attention. |
| **Safe-to-Spend Calculator** | Computes a safe daily spending limit for the rest of the month while preserving a 20% savings target. |
| **Natural Language Story Cards** | Narrative cards for savings rate forecast, micro-spending patterns, zero-spend streak recognition, and weekend vs. weekday spending persona. |
| **Category Breakdown** | Horizontal bar chart with colour-coded categories and percentage shares. |
| **Monthly Comparison** | 6-month bar chart overlaying income and expenses to reveal seasonal trends. |
| **Smart Actions (Prescriptive)** | Context-aware action cards. Deficit users receive emergency protocol suggestions; healthy users receive optimisation and investment nudges. |
| **50/30/20 Budget Deviation** | Tracks actual spending against Needs/Wants/Savings target ratios and flags overages. |
| **Opportunity Cost Calculator** | Shows the 10-year future value (at 7% annual return) of redirecting discretionary spending into investments. |
| **Quick Wins** | Three tailored micro-tips based on the current savings rate and daily spending average. |

---

### 5. Admin Settings Panel

Accessible to Admins only, with two categories of controls:

**Algorithm Constants** — Adjust global parameters that power all insight calculations:
- Market return rate (default: 7%)
- Target savings rate (default: 20%)
- Micro-spend threshold (default: $15)
- Outlier exclusion toggle

**What-If Simulation** — Sliders to apply income and expense multipliers (±50%) across all insight calculations in real time, without modifying actual transaction data. Useful for modelling pay raises, budget cuts, or lifestyle changes.

---

### 6. Dark Mode & PWA

- **Dark mode** — Toggled from the navigation bar. Preference is stored in `localStorage` and applied as a Tailwind `dark:` class on the `<html>` element immediately on load, preventing flash of unstyled content.
- **Progressive Web App** — The Angular Service Worker caches assets for offline access. A Web App Manifest with icons from 72px to 512px allows the app to be installed on mobile and desktop home screens.

---

## 📁 Project Structure

```
finance-companion/
├── src/
│   ├── app/
│   │   ├── components/               # Shared UI components
│   │   │   ├── stat-card.component.ts    # Reusable KPI card
│   │   │   └── toast.component.ts        # Global notification toast
│   │   │
│   │   ├── data/
│   │   │   └── mock-transactions.ts      # Seed dataset (50+ transactions)
│   │   │
│   │   ├── directives/
│   │   │   └── permission.directive.ts   # [appHasRole] structural directive
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts             # Route guard → redirects unauthenticated users
│   │   │
│   │   ├── models/
│   │   │   ├── transaction.model.ts      # Transaction, UserRole, SortField types
│   │   │   └── time-range.model.ts       # DateRange, TimeRangePreset types
│   │   │
│   │   ├── pipes/
│   │   │   └── currency-format.pipe.ts   # Locale-aware USD formatting
│   │   │
│   │   ├── services/
│   │   │   ├── finance-state.service.ts  # ★ Central state (Angular Signals)
│   │   │   ├── role.service.ts           # Auth & role management (RxJS)
│   │   │   ├── insights.service.ts       # All analytics & financial calculations
│   │   │   ├── admin-settings.service.ts # Algorithm constants & simulation modifiers
│   │   │   ├── currency.service.ts       # Currency formatting helpers
│   │   │   ├── data.service.ts           # Legacy data access layer
│   │   │   ├── dashboard.service.ts      # Dashboard-specific computed data
│   │   │   ├── insights-api.service.ts   # Mock API wrapper with delay simulation
│   │   │   └── toast.service.ts          # Global notification service
│   │   │
│   │   ├── store/
│   │   │   └── financeStore.ts           # Zustand store (auxiliary state)
│   │   │
│   │   ├── utils/
│   │   │   ├── finance-analytics.ts      # Pure functions: filter, summarise, group
│   │   │   ├── date-range.ts             # Date range computation helpers
│   │   │   └── dataLoader.ts             # Data loading utilities
│   │   │
│   │   ├── dashboard.component.*         # Dashboard page
│   │   ├── transaction.component.*       # Transactions page
│   │   ├── insights.component.*          # Insights page
│   │   ├── login/                        # Login page
│   │   ├── layout/                       # App shell (nav, sidebar)
│   │   ├── landing/                      # Welcome component
│   │   └── app.routes.ts                 # Lazy-loaded route definitions
│   │
│   ├── environments/
│   │   └── environment.ts
│   └── styles.css                        # Global Tailwind + custom CSS
│
├── public/
│   ├── icons/                            # PWA icons (72px – 512px)
│   ├── manifest.webmanifest              # Web App Manifest
│   └── insights-api-mock.json           # Static mock API response
│
├── angular.json
├── tailwind.config.js
├── netlify.toml                          # SPA redirect rules
├── ngsw-config.json                      # Service Worker caching config
└── package.json
```

---

## 🏗 Architecture & Design Decisions

### State Management — Angular Signals over NgRx

The primary state container is `FinanceStateService`, built entirely on Angular's native **Signals API**. This was chosen deliberately over NgRx/Redux to avoid boilerplate while still achieving fine-grained reactivity and automatic dependency tracking.

```
Signals (mutable)         Computed Signals (derived, read-only)
─────────────────         ──────────────────────────────────────────
_transactions             filteredTransactions
_role                     transactionsInReportRange
isDark                    periodSummary
timeRangePreset           periodComparison
searchQuery               expenseByCategoryInPeriod
categoryFilter            reportRange / previousRange
sortField / sortDirection
```

Every signal change is automatically persisted to `localStorage` via Angular `effect()` — no manual subscription management required.

**Why two state solutions?**
`RoleService` uses **RxJS BehaviorSubjects** for auth/role because it needs to handle cross-tab `storage` events via `fromEvent()`, which is a natural fit for RxJS. `FinanceStateService` uses Signals for everything else. **Zustand** (`financeStore.ts`) demonstrates interoperability with a third-party store library.

---

### Lazy Loading

All three main pages are lazy-loaded via `loadComponent()` in the Angular Router. Only the login page and app shell load on initial paint, keeping the first-load bundle lean.

```typescript
// app.routes.ts — all pages are lazily loaded
{
  path: 'dashboard',
  loadComponent: () =>
    import('./dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard],
}
```

---

### Permission Directive — Reactive RBAC in Templates

The `[appHasRole]` structural directive reactively shows/hides template blocks based on role. It subscribes to `combineLatest([role$, isAuthenticated$])` and updates the DOM the moment either stream emits.

```html
<!-- Visible only to admins -->
<div *appHasRole="'admin'">
  <button (click)="addTransaction()">+ Add Transaction</button>
  <button (click)="deleteTransaction(id)">Delete</button>
</div>
```

---

### Analytics Architecture — Pure Functions + Service Layer

Financial computations are split across two layers to keep them testable and reusable:

1. **`utils/finance-analytics.ts`** — Stateless pure functions (filter by range, summarise transactions, group by day/week, category breakdown). These can be unit-tested in complete isolation.
2. **`InsightsService`** — Orchestrates the pure functions and applies business logic: Health Score algorithm, 50/30/20 budget model, opportunity cost formula, weekend persona detection, micro-spend analysis.

---

### Mock API Simulation

`InsightsApiService` wraps data access with an artificial delay (`mockApiDelay`, default 400ms) to realistically simulate async API latency. The static `public/insights-api-mock.json` file acts as a REST endpoint stub, showing how the service layer would integrate with a real backend with minimal changes.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v10 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Adxrsh-17/finance-companion.git
cd finance-companion

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will be available at **http://localhost:4200**

### Build for Production

```bash
npm run build
# Output → dist/finance-dashboard/browser/
```

> The `netlify.toml` file configures a catch-all `/* → /index.html` redirect so Angular's client-side routing works correctly when deployed to Netlify.

### Run Tests

```bash
npm test
# Runs the Vitest test suite
```

---

## 🖥 Using the Application

### Step 1 — Log In

Navigate to `/login`. Enter any email address and select a role (**Admin** or **Viewer**) from the dropdown. Click **Sign In**.

> There is no password validation — authentication is intentionally simulated. The session is persisted in `localStorage` and survives page refreshes.

**Live Demo credentials:**

| Field | Value |
|---|---|
| URL | https://agent-69d1f4cecf84307613c--finance-companion-app.netlify.app/login |
| Email | Any email address |
| Admin role | Full read/write access (CRUD, Admin Settings, simulation) |
| Viewer role | Read-only access |

---

### Step 2 — Explore the Dashboard

1. Use the **time range selector** at the top to switch between `7 Days`, `Month`, `Year`, or `Custom`. All cards and charts update instantly.
2. Hover over chart data points for exact value tooltips.
3. The **percentage badge** on each summary card shows change vs. the equivalent prior period (e.g., this month vs. last month).

---

### Step 3 — Manage Transactions (Admin only)

1. Click **Add Transaction** → fill in date, amount, category, type, and an optional note → click **Save**.
2. Click the **edit icon** on any row to modify a transaction.
3. Click the **delete icon** to remove a transaction (confirmation prompt shown).
4. Use **Export CSV** or **Export JSON** to download your data.
5. Use **Reset to Mock Data** to restore the original seed dataset at any time.

---

### Step 4 — Read the Insights Page

1. The **Financial Health Score** card at the top summarises your overall position.
2. Scroll through the **Story Cards** for plain-English narratives about your financial behaviour.
3. Review **Smart Actions** for prioritised, prescriptive recommendations.
4. Check the **50/30/20 Budget Deviation** bars to see how your spending compares to the recommended model.
5. Use the **Opportunity Cost** panel to understand the long-term value of cutting discretionary spending.

---

### Step 5 — Admin Settings (Admin only)

1. Open **Admin Settings** from the navigation menu.
2. Adjust **Algorithm Constants** (market return rate, savings target, micro-spend threshold) to recalibrate all insight calculations.
3. Enable **Simulation Mode** and move the income/expense sliders (±50%) to model what-if scenarios without touching actual transaction data.

---

## 📊 Data Model

### Transaction

```typescript
export interface Transaction {
  id:       string;           // UUID or timestamp-based unique ID
  date:     string;           // ISO 8601 date string (YYYY-MM-DD)
  amount:   number;           // Positive monetary value in USD
  category: string;           // e.g. 'Salary', 'Food & Dining', 'Transport'
  type:     'income' | 'expense';
  note?:    string;           // Optional memo
}
```

### UserRole

```typescript
export type UserRole = 'admin' | 'viewer';
```

### TimeRangePreset

```typescript
export type TimeRangePreset = '7d' | 'month' | 'year' | 'custom';
// 'custom' → user selects a specific month + year
```

---

## 🛡 Edge Case Handling

| Scenario | How it's handled |
|---|---|
| **No transactions in selected period** | All charts and insight components render empty-state messages/illustrations — no blank or broken UI. |
| **Expenses exceed income** | Health Score drops below 50; Smart Actions switch to Emergency Protocol; Safe-to-Spend card shows a deficit alert instead of a daily limit. |
| **Single-transaction periods** | Period comparison gracefully returns 0% change rather than dividing by zero. |
| **Corrupt localStorage** | `parseStoredTransactions` validates JSON on load; if parsing fails or the array is empty, the app silently resets to the mock dataset. |
| **Cross-tab role sync** | A `storage` event listener in `RoleService` keeps the role and auth state in sync if the user modifies localStorage in another browser tab. |
| **Viewer accessing write endpoints** | The auth guard protects routes, and the `[appHasRole]` directive removes write controls from the DOM entirely — Viewers cannot trigger add/edit/delete even via DevTools. |

---

##  Optional Enhancements Implemented

| Enhancement | Implementation |
|---|---|
| **Dark Mode** | Full dark theme via Tailwind `dark:` variants; toggled by `FinanceStateService.toggleDarkMode()` and persisted to `localStorage`. |
| **Data Persistence** | Every state change (transactions, role, theme, filters, time range) is written to `localStorage` via Angular `effect()`. |
| **Mock API Integration** | `InsightsApiService` simulates async API calls with configurable artificial network delay (default 400ms). |
| **Export CSV / JSON** | `exportCsv()` and `exportJson()` on `FinanceStateService`; PapaParse handles CSV serialisation. |
| **Advanced Filtering** | Compound filters (search + category + type + date scope) are applied simultaneously to a single reactive `computed` signal — no redundant re-renders. |
| **PWA** | Angular Service Worker with `ngsw-config.json`, Web App Manifest, and multi-resolution icons (72px–512px) for install-to-homescreen on mobile and desktop. |
| **Animations / Transitions** | CSS transitions on card hover, chart loading, and toast notifications. |
| **What-If Simulation** | Admin-only sliders apply income/expense multipliers to all insight calculations in real time without modifying source data. |

---

<div align="center">

Built with Angular 21 · Tailwind CSS · Chart.js · TypeScript

*All data is simulated. No real financial data is stored or transmitted.*

**[🔗 Live Demo](https://agent-69d1f4cecf84307613c--finance-companion-app.netlify.app/login)** &nbsp;·&nbsp; **[⬡ GitHub](https://github.com/Adxrsh-17/finance-companion)**

</div>
