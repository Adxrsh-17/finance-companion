\documentclass[12pt, a4paper]{article}

% ── Packages ────────────────────────────────────────────────────────────────
\usepackage[a4paper, margin=2.5cm]{geometry}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{booktabs}
\usepackage{array}
\usepackage{tabularx}
\usepackage{fontenc}
\usepackage{inputenc}
\usepackage{parskip}
\usepackage{mdframed}
\usepackage{tcolorbox}
\usepackage{tikz}

% ── Colours ─────────────────────────────────────────────────────────────────
\definecolor{primary}{HTML}{4F46E5}
\definecolor{secondary}{HTML}{7C3AED}
\definecolor{accent}{HTML}{06B6D4}
\definecolor{success}{HTML}{10B981}
\definecolor{warning}{HTML}{F59E0B}
\definecolor{danger}{HTML}{EF4444}
\definecolor{codebg}{HTML}{1E1E2E}
\definecolor{codefg}{HTML}{CDD6F4}
\definecolor{inlinebg}{HTML}{F1F5F9}
\definecolor{inlinefg}{HTML}{334155}
\definecolor{border}{HTML}{E2E8F0}
\definecolor{sectioncolor}{HTML}{1E293B}
\definecolor{linkcolor}{HTML}{4F46E5}

% ── Hyperref setup ──────────────────────────────────────────────────────────
\hypersetup{
  colorlinks   = true,
  linkcolor    = linkcolor,
  urlcolor     = linkcolor,
  citecolor    = linkcolor,
  pdftitle     = {Finance Companion — README},
  pdfauthor    = {Adarsh Pradeep},
}

% ── Section title styling ───────────────────────────────────────────────────
\titleformat{\section}
  {\Large\bfseries\color{sectioncolor}}
  {}
  {0em}
  {}[\color{primary}\titlerule]

\titleformat{\subsection}
  {\large\bfseries\color{sectioncolor}}
  {}
  {0em}
  {}

\titleformat{\subsubsection}
  {\normalsize\bfseries\color{primary}}
  {}
  {0em}
  {}

% ── Header / footer ─────────────────────────────────────────────────────────
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\color{primary}\textbf{Finance Companion}}
\fancyhead[R]{\small\color{gray}Adarsh Pradeep}
\fancyfoot[C]{\small\color{gray}\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0pt}

% ── Code listing style (dark terminal) ──────────────────────────────────────
\lstdefinestyle{terminal}{
  backgroundcolor   = \color{codebg},
  basicstyle        = \ttfamily\small\color{codefg},
  breaklines        = true,
  frame             = none,
  xleftmargin       = 1em,
  xrightmargin      = 1em,
  aboveskip         = 0.8em,
  belowskip         = 0.8em,
  showstringspaces  = false,
}

% ── Inline code ─────────────────────────────────────────────────────────────
\newcommand{\code}[1]{%
  \colorbox{inlinebg}{\texttt{\color{inlinefg}\small #1}}%
}

% ── Tip / Note / Warning boxes ───────────────────────────────────────────────
\tcbuselibrary{skins, breakable}

\newtcolorbox{notebox}{
  colback   = blue!5!white,
  colframe  = primary,
  boxrule   = 0.5pt,
  arc       = 3pt,
  left      = 6pt, right = 6pt, top = 4pt, bottom = 4pt,
  fonttitle = \bfseries\small,
  title     = \textcolor{primary}{ℹ\; Note},
  breakable,
}

\newtcolorbox{warnbox}{
  colback   = warning!10!white,
  colframe  = warning,
  boxrule   = 0.5pt,
  arc       = 3pt,
  left      = 6pt, right = 6pt, top = 4pt, bottom = 4pt,
  fonttitle = \bfseries\small,
  title     = \textcolor{warning}{⚠\; Important},
  breakable,
}

\newtcolorbox{featurebox}[1]{
  colback   = primary!5!white,
  colframe  = primary,
  boxrule   = 0.5pt,
  arc       = 3pt,
  left      = 6pt, right = 6pt, top = 4pt, bottom = 4pt,
  fonttitle = \bfseries\small\color{white},
  coltitle  = white,
  colbacktitle = primary,
  title     = #1,
  breakable,
}

% ── Badge command ────────────────────────────────────────────────────────────
\newcommand{\badge}[2]{%
  \tikz[baseline=(X.base)]\node[fill=#1, text=white, rounded corners=2pt,
    inner xsep=4pt, inner ysep=1pt, font=\ttfamily\scriptsize] (X) {#2};%
}

% ════════════════════════════════════════════════════════════════════════════
\begin{document}

% ── Title block ─────────────────────────────────────────────────────────────
\begin{center}
  {\Huge\bfseries\color{primary} Finance Companion}\\[0.4em]
  {\large\color{gray} A full-featured personal finance dashboard built with Angular 21}\\[1em]

  \badge{primary}{Angular 21}
  \hspace{4pt}\badge{secondary}{Tailwind CSS}
  \hspace{4pt}\badge{accent}{Chart.js}
  \hspace{4pt}\badge{success}{TypeScript}
  \hspace{4pt}\badge{warning}{Zustand}
  \hspace{4pt}\badge{danger}{PWA}\\[0.8em]

  \href{https://agent-69d1f4cecf84307613c--finance-companion-app.netlify.app/login}%
    {\textbf{\color{primary}🔗 Live Demo}} \quad|\quad
  \href{https://github.com/Adxrsh-17/finance-companion}%
    {\textbf{\color{primary}⬡ GitHub Repository}}\\[0.5em]

  \textit{\color{gray}Author: Adarsh Pradeep \quad|\quad ads.vibgyor.17@gmail.com}
\end{center}

\vspace{0.5em}
\noindent\textcolor{border}{\rule{\linewidth}{1pt}}
\vspace{0.5em}

% ── Table of Contents ───────────────────────────────────────────────────────
\tableofcontents
\newpage

% ════════════════════════════════════════════════════════════════════════════
\section{Project Overview}

Finance Companion is a responsive single-page application that lets users track income, expenses, and financial health through an intuitive, chart-driven interface. The project was built from scratch with a strong emphasis on clean architecture, reactive state management, and UX polish.

The application is structured around three main views — \textbf{Dashboard}, \textbf{Transactions}, and \textbf{Insights} — gated behind a lightweight authentication flow, with role-based UI behaviour that changes meaningfully depending on whether the logged-in user is an \textbf{Admin} or a \textbf{Viewer}.

\begin{notebox}
No backend or database is required. All data is seeded from a mock dataset and persisted in \texttt{localStorage}, making the app fully self-contained and ready to run offline.
\end{notebox}

% ════════════════════════════════════════════════════════════════════════════
\section{Tech Stack}

\begin{tabularx}{\linewidth}{>{\bfseries}l X}
  \toprule
  Layer & Choice \\
  \midrule
  Framework      & Angular 21 (standalone components, signals API) \\
  Styling        & Tailwind CSS v3 + custom CSS \\
  Charts         & Chart.js v4 \\
  Date utilities & date-fns v4 \\
  State          & Angular Signals (\code{FinanceStateService}) + Zustand (store utilities) \\
  CSV export     & PapaParse v5 \\
  Build tooling  & Angular CLI v21, esbuild, Vitest \\
  Deployment     & Netlify (with \code{netlify.toml} redirect rules for SPA routing) \\
  PWA            & Angular Service Worker (\code{ngsw-config.json} + Web App Manifest) \\
  \bottomrule
\end{tabularx}

% ════════════════════════════════════════════════════════════════════════════
\section{Features}

\subsection{Dashboard Overview}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Summary cards} — Total Balance, Income, Expenses, and Net Savings, each with a period-over-period percentage change indicator (green for improvement, red for decline).
  \item \textbf{Balance Trend chart} — Line chart showing the running balance over the selected reporting period.
  \item \textbf{Income vs.\ Expense chart} — Grouped bar chart bucketed by day (for ≤14 days) or week (for longer ranges).
  \item \textbf{Spending Breakdown chart} — Doughnut/pie chart showing expense share per category.
  \item \textbf{Time range selector} — Switch between 7 Days, Month, Year, or a fully custom month/year picker without reloading the page.
\end{itemize}

\subsection{Transactions}

\begin{itemize}[leftmargin=1.5em]
  \item Paginated table of transactions showing date, category, type (income/expense), amount, and an optional note.
  \item \textbf{Search} — Real-time full-text search across category, note, and amount fields.
  \item \textbf{Filter} — Dropdown filters for category and transaction type (All / Income / Expense).
  \item \textbf{Sorting} — Click column headers to sort by date, amount, or category (ascending/descending toggle).
  \item \textbf{Date scope toggle} — View transactions for the active reporting period only, or all-time.
  \item \textbf{Admin-only controls} — Add, edit, and delete transactions are conditionally rendered using the \code{[appHasRole]} structural directive; Viewers never see these controls.
  \item \textbf{Export} — Download the full dataset as CSV or JSON with a single button click.
  \item \textbf{Reset} — Revert to the original mock dataset at any time.
\end{itemize}

\subsection{Role-Based UI (RBAC)}

Two roles are supported and can be switched at the login screen or at any time from the role toggle in the navigation bar.

\begin{tabularx}{\linewidth}{>{\bfseries}l X}
  \toprule
  Role & Capabilities \\
  \midrule
  Viewer & Read-only access to all three pages. Add / Edit / Delete controls and Admin Settings are hidden. \\
  Admin  & Full CRUD on transactions, access to the Admin Settings panel (algorithm constants + simulation modifiers), and the What-If scenario simulator. \\
  \bottomrule
\end{tabularx}

\medskip
Role state is stored in \code{localStorage} and survives page refreshes. The \code{RoleService} exposes reactive observables (\code{role\$}, \code{isAdmin\$}, \code{isViewer\$}) so any component can react to role changes instantly without polling.

\subsection{Insights}

The Insights page generates a rich, data-driven narrative from the current period's transactions:

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Financial Health Score} (0–100) — Composite score based on savings rate, net cash flow, and zero-spend streak. Rated Excellent / Good / Fair / Needs Attention.
  \item \textbf{Safe-to-Spend Calculator} — Computes a safe daily spending limit for the remainder of the month while preserving a 20\% savings target.
  \item \textbf{Natural Language Stories} — Narrative cards for savings rate forecast, micro-spending patterns, zero-spend streak recognition, and weekend-vs-weekday spending persona.
  \item \textbf{Category Breakdown} — Horizontal bar chart with colour-coded categories and percentage shares.
  \item \textbf{Monthly Comparison} — 6-month bar chart overlaying income and expenses to reveal seasonal trends.
  \item \textbf{Smart Actions (Prescriptive Analytics)} — Context-aware action cards. Users in deficit receive emergency protocol suggestions; healthy users receive optimisation and investment nudges.
  \item \textbf{50/30/20 Budget Deviation} — Tracks actual spending against the Needs/Wants/Savings target ratios and flags overages.
  \item \textbf{Opportunity Cost Calculator} — Illustrates the 10-year future value of discretionary spending if redirected to a 7\% annual return portfolio.
  \item \textbf{Quick Wins} — Three actionable micro-tips tailored to current savings rate and daily spending average.
\end{itemize}

\subsection{Admin Settings Panel}

Accessible to Admins only. Provides two categories of controls:

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Algorithm Constants} — Adjust market return rate (default 7\%), target savings rate (default 20\%), and micro-spend threshold (default \$15).
  \item \textbf{What-If Simulation} — Sliders to apply income and expense multipliers (\(\pm\)50\%) across all insight calculations without modifying actual data.
\end{itemize}

\subsection{Dark Mode \& PWA}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Dark mode} — Toggleable from the navigation bar. Preference is persisted in \code{localStorage} and automatically applied to the \code{<html>} element via a Tailwind \code{dark:} class.
  \item \textbf{Progressive Web App} — The Angular Service Worker caches assets for offline use. A Web App Manifest with icons (72px to 512px) allows the app to be installed on mobile and desktop.
\end{itemize}

% ════════════════════════════════════════════════════════════════════════════
\section{Project Structure}

\begin{lstlisting}[style=terminal]
finance-companion/
├── src/
│   ├── app/
│   │   ├── components/           # Shared UI components (stat-card, toast)
│   │   ├── data/
│   │   │   └── mock-transactions.ts  # Seed dataset (50+ transactions)
│   │   ├── directives/
│   │   │   └── permission.directive.ts  # [appHasRole] structural directive
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # Route guard (redirects unauthenticated users)
│   │   ├── models/
│   │   │   ├── transaction.model.ts  # Transaction, UserRole, SortField types
│   │   │   └── time-range.model.ts  # DateRange, TimeRangePreset types
│   │   ├── pipes/
│   │   │   └── currency-format.pipe.ts  # Locale-aware currency formatting
│   │   ├── services/
│   │   │   ├── finance-state.service.ts  # Central state (Angular Signals)
│   │   │   ├── role.service.ts           # Auth & role management (RxJS)
│   │   │   ├── insights.service.ts       # All analytics calculations
│   │   │   ├── admin-settings.service.ts # Algorithm constants & simulation
│   │   │   ├── currency.service.ts       # Currency formatting helpers
│   │   │   ├── data.service.ts           # Legacy data access layer
│   │   │   ├── dashboard.service.ts      # Dashboard-specific computed data
│   │   │   ├── insights-api.service.ts   # Mock API wrapper (with delay sim)
│   │   │   └── toast.service.ts          # Global notification service
│   │   ├── store/
│   │   │   └── financeStore.ts    # Zustand store (utility state)
│   │   ├── utils/
│   │   │   ├── finance-analytics.ts  # Pure functions (filter, summarise, group)
│   │   │   ├── date-range.ts         # Date range computation helpers
│   │   │   └── dataLoader.ts         # Data loading utilities
│   │   ├── dashboard.component.*     # Dashboard page
│   │   ├── transaction.component.*   # Transactions page
│   │   ├── insights.component.*      # Insights page
│   │   ├── login/                    # Login page
│   │   ├── layout/                   # App shell (nav, sidebar)
│   │   ├── landing/                  # Landing/welcome component
│   │   └── app.routes.ts             # Lazy-loaded route definitions
│   ├── environments/
│   │   └── environment.ts
│   └── styles.css                    # Global Tailwind + custom CSS
├── public/
│   ├── icons/                        # PWA icons (72px – 512px)
│   ├── manifest.webmanifest
│   └── insights-api-mock.json        # Static mock API response
├── angular.json
├── tailwind.config.js
├── netlify.toml                      # SPA redirect rules
└── ngsw-config.json                  # Service Worker caching config
\end{lstlisting}

% ════════════════════════════════════════════════════════════════════════════
\section{Architecture \& Design Decisions}

\subsection{State Management}

The primary state container is \code{FinanceStateService}, built on Angular's native \textbf{Signals API}. This avoids the boilerplate of Redux/NgRx while still providing fine-grained reactivity and automatic dependency tracking.

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Signals} power all mutable state: transactions, role, dark mode preference, time range preset, filter values, and sort direction.
  \item \textbf{Computed signals} derive all secondary values (filtered transactions, period summary, previous period comparison, bar chart data) automatically — no manual subscriptions or \code{combineLatest} chains.
  \item \textbf{Effects} persist every state change to \code{localStorage} as a side effect, ensuring data survival across page reloads.
  \item \textbf{RoleService} uses \textbf{RxJS BehaviorSubjects} for the authentication and role streams, exposing reactive observables (\code{role\$}, \code{isAuthenticated\$}) that components can consume via \code{async} pipe or \code{toSignal()}.
  \item \textbf{Zustand} (\code{financeStore.ts}) handles auxiliary UI state and serves as a demonstration of an alternative state approach alongside Angular Signals.
\end{itemize}

\subsection{Lazy Loading}

All three main pages (Dashboard, Transactions, Insights) are lazy-loaded via the Angular Router's \code{loadComponent()} API. This means only the login page and app shell JavaScript is shipped on initial load, keeping the first-paint bundle small.

\subsection{Permission Directive}

The custom \code{[appHasRole]} structural directive conditionally renders template blocks based on the current role. It reacts to the \code{role\$} observable in real time, meaning the UI updates instantly when the role is switched — no page reload required.

\begin{lstlisting}[style=terminal]
<!-- Only visible to admins -->
<button *appHasRole="'admin'" (click)="addTransaction()">
  + Add Transaction
</button>
\end{lstlisting}

\subsection{Analytics \& Calculations}

All financial computations live in two places:

\begin{itemize}[leftmargin=1.5em]
  \item \code{src/app/utils/finance-analytics.ts} — Pure, stateless functions (filter by range, summarise, group by day/week, category breakdown). These are unit-testable in isolation.
  \item \code{InsightsService} — Orchestrates the pure functions and applies business rules (health score algorithm, 50/30/20 budget model, opportunity cost formula, weekend persona detection).
\end{itemize}

\subsection{Mock API Simulation}

\code{InsightsApiService} wraps data access with an artificial network delay (\code{mockApiDelay}, default 400ms) to simulate real API latency. The insights JSON (\code{public/insights-api-mock.json}) acts as a static REST endpoint, demonstrating how the app would integrate with a real backend.

% ════════════════════════════════════════════════════════════════════════════
\section{Getting Started}

\subsection{Prerequisites}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Node.js} v18 or higher
  \item \textbf{npm} v10 or higher (or \textbf{yarn} / \textbf{pnpm})
  \item Angular CLI v21 (installed automatically via \code{npx} if not global)
\end{itemize}

\subsection{Installation}

\begin{lstlisting}[style=terminal]
# 1. Clone the repository
git clone https://github.com/Adxrsh-17/finance-companion.git
cd finance-companion

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
# App is available at http://localhost:4200
\end{lstlisting}

\subsection{Build for Production}

\begin{lstlisting}[style=terminal]
npm run build
# Output is placed in dist/finance-dashboard/browser/
\end{lstlisting}

\begin{notebox}
The \code{netlify.toml} file configures a catch-all redirect (\code{/* → /index.html}) so Angular's client-side routing works correctly when deployed to Netlify.
\end{notebox}

\subsection{Run Tests}

\begin{lstlisting}[style=terminal]
npm test
# Runs the Vitest test suite
\end{lstlisting}

% ════════════════════════════════════════════════════════════════════════════
\section{Using the Application}

\subsection{Logging In}

Navigate to \code{/login}. Enter any email address and select a role (\textbf{Admin} or \textbf{Viewer}) from the dropdown. Click \textbf{Sign In}. The role and authentication state are stored in \code{localStorage}, so the session survives browser refreshes.

\begin{warnbox}
There is no password validation — authentication is intentionally simulated for demonstration purposes. The focus is on UI behaviour driven by role, not credential security.
\end{warnbox}

\subsection{Switching Roles}

Use the role toggle in the top navigation bar to switch between Admin and Viewer at any time. The UI will immediately show or hide admin-only controls (Add / Edit / Delete buttons, Admin Settings panel) without a page reload.

\subsection{Navigating the Dashboard}

\begin{enumerate}[leftmargin=1.5em]
  \item Use the \textbf{time range selector} (7 Days / Month / Year / Custom) to change the reporting window. All cards and charts update reactively.
  \item Hover over chart data points for tooltips with exact values.
  \item The \textbf{Period Comparison} badges on each summary card show the percentage change relative to the equivalent prior period.
\end{enumerate}

\subsection{Managing Transactions (Admin only)}

\begin{enumerate}[leftmargin=1.5em]
  \item Click \textbf{Add Transaction} to open the transaction form modal. Fill in the date, amount, category, type, and an optional note.
  \item Click the \textbf{edit icon} on any row to modify an existing transaction inline.
  \item Click the \textbf{delete icon} to remove a transaction (with a confirmation prompt).
  \item Use \textbf{Export CSV} or \textbf{Export JSON} to download the full dataset.
  \item Use \textbf{Reset to Mock Data} to restore the original seed dataset.
\end{enumerate}

\subsection{Reading the Insights Page}

\begin{enumerate}[leftmargin=1.5em]
  \item The \textbf{Financial Health Score} card at the top summarises your overall financial position.
  \item Scroll through the \textbf{Story Cards} for plain-English narratives about your spending behaviour.
  \item Check \textbf{Smart Actions} for prioritised, prescriptive recommendations.
  \item Review the \textbf{50/30/20 Budget Deviation} bars to see how your spending compares to the recommended model.
  \item Use the \textbf{Opportunity Cost} panel to understand the long-term value of reducing discretionary spending.
\end{enumerate}

\subsection{Admin Settings (Admin only)}

\begin{enumerate}[leftmargin=1.5em]
  \item Open \textbf{Admin Settings} from the navigation menu.
  \item Adjust \textbf{Algorithm Constants} (market return rate, savings target, micro-spend threshold) to recalibrate all insight calculations.
  \item Enable \textbf{Simulation Mode} and move the income/expense sliders to model what-if scenarios (\(\pm\)50\%) without touching actual transaction data.
\end{enumerate}

% ════════════════════════════════════════════════════════════════════════════
\section{Data Model}

\subsection{Transaction}

\begin{tabularx}{\linewidth}{>{\ttfamily}l >{\bfseries}l X}
  \toprule
  Field & Type & Description \\
  \midrule
  id       & string           & UUID or timestamp-based unique identifier \\
  date     & string           & ISO 8601 date string (\texttt{YYYY-MM-DD}) \\
  amount   & number           & Positive monetary value in USD \\
  category & string           & Free-form label (e.g.\ Salary, Food, Transport) \\
  type     & \textquotesingle income\textquotesingle{} | \textquotesingle expense\textquotesingle & Transaction direction \\
  note     & string?          & Optional human-readable memo \\
  \bottomrule
\end{tabularx}

\subsection{UserRole}

Two literal types: \code{'admin'} and \code{'viewer'}.

\subsection{TimeRangePreset}

\code{'7d'} | \code{'month'} | \code{'year'} | \code{'custom'}. For \code{'custom'}, the user selects a specific month and year.

% ════════════════════════════════════════════════════════════════════════════
\section{Responsiveness}

The layout uses a Tailwind CSS responsive grid. On mobile (below \code{md} breakpoint), the sidebar collapses to a bottom navigation bar, summary cards stack vertically, and charts resize to fill the viewport width. On tablet and desktop, the sidebar is persistent and the grid expands to multi-column layouts. No horizontal scrollbars appear at any standard viewport width.

% ════════════════════════════════════════════════════════════════════════════
\section{Edge Case Handling}

\begin{itemize}[leftmargin=1.5em]
  \item \textbf{Empty data state} — All charts and insight components render placeholder messages or empty-state illustrations when no transactions exist for the selected period.
  \item \textbf{Deficit periods} — If expenses exceed income, the Health Score drops below 50, Smart Actions switch to Emergency Protocol mode, and the Safe-to-Spend card shows a deficit alert.
  \item \textbf{Single-transaction periods} — Analytics that require at least two data points (e.g.\ period comparison) gracefully fall back to 0\% change rather than throwing divide-by-zero errors.
  \item \textbf{Corrupt localStorage} — \code{parseStoredTransactions} validates the stored JSON; if parsing fails or the array is empty, the app silently resets to the mock dataset.
  \item \textbf{Cross-tab role sync} — A \code{storage} event listener in \code{RoleService} keeps the role in sync if the user changes it in another browser tab.
\end{itemize}

% ════════════════════════════════════════════════════════════════════════════
\section{Optional Enhancements Implemented}

\begin{tabularx}{\linewidth}{>{\bfseries}l X}
  \toprule
  Enhancement & Implementation \\
  \midrule
  Dark Mode          & Full dark theme via Tailwind \code{dark:} variants; toggled by \code{FinanceStateService.toggleDarkMode()} and persisted to \code{localStorage}. \\
  Data Persistence   & Every state change (transactions, role, theme, filters, time range) is written to \code{localStorage} via Angular \code{effect()}. \\
  Mock API           & \code{InsightsApiService} simulates async API calls with configurable artificial delay. \\
  Export CSV / JSON  & \code{exportCsv()} and \code{exportJson()} methods on \code{FinanceStateService}; PapaParse handles CSV serialisation. \\
  Advanced Filtering & Compound filters (search + category + type + date scope) applied simultaneously to a single reactive computed signal. \\
  PWA                & Angular Service Worker with \code{ngsw-config.json}, Web App Manifest, and multi-resolution icons for install-to-homescreen. \\
  Animations         & CSS transitions on card hover, chart data loading, and toast notifications. \\
  What-If Simulation & Admin-only sliders apply income/expense multipliers to all insight calculations in real time. \\
  \bottomrule
\end{tabularx}

% ════════════════════════════════════════════════════════════════════════════
\section{Known Limitations}

\begin{itemize}[leftmargin=1.5em]
  \item There is no real backend, authentication server, or database. All data is ephemeral to the browser session unless \code{localStorage} is available.
  \item The application has been tested on Chrome, Firefox, and Safari. Internet Explorer is not supported.
  \item Export functionality requires the Blob and URL APIs, which are available in all modern browsers.
\end{itemize}

% ════════════════════════════════════════════════════════════════════════════
\section{Live Demo Credentials}

\begin{tabularx}{\linewidth}{>{\bfseries}l X}
  \toprule
  Field & Value \\
  \midrule
  URL   & \url{https://agent-69d1f4cecf84307613c--finance-companion-app.netlify.app/login} \\
  Email & Any valid email address (no real validation) \\
  Admin & Select \textbf{Admin} from the role dropdown for full write access \\
  Viewer & Select \textbf{Viewer} for read-only mode \\
  \bottomrule
\end{tabularx}

% ════════════════════════════════════════════════════════════════════════════
\section{Author}

\textbf{Adarsh Pradeep}\\
Email: \href{mailto:ads.vibgyor.17@gmail.com}{ads.vibgyor.17@gmail.com}\\
GitHub: \href{https://github.com/Adxrsh-17}{github.com/Adxrsh-17}

\vspace{1em}
\noindent\textcolor{border}{\rule{\linewidth}{0.5pt}}
\vspace{0.3em}
\begin{center}
  \small\color{gray}
  Built with Angular 21 · Tailwind CSS · Chart.js · TypeScript\\
  \textit{All data is simulated. No real financial data is stored or transmitted.}
\end{center}

\end{document}
