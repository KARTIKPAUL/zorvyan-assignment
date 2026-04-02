# FinFlow — Finance Dashboard

A clean, interactive personal finance dashboard built with **Next.js 16** and **Tailwind CSS v4**. Designed for the Zorvyn Frontend Developer Intern assignment.

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd zorvyn-assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
zorvyn-assignment/
├── app/
│   ├── globals.css              # Design tokens, CSS variables, animations
│   ├── layout.js                # Root HTML layout + metadata
│   └── page.js                  # Entry point — mounts AppProvider + AppShell
│
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx         # Main layout: sidebar + header + page routing
│   │   ├── Sidebar.jsx          # Navigation, role switcher, dark mode toggle
│   │   └── Header.jsx           # Sticky header with balance, role badge, theme toggle
│   │
│   ├── dashboard/
│   │   ├── Dashboard.jsx        # Composes all dashboard widgets
│   │   ├── SummaryCards.jsx     # Balance / Income / Expenses / Savings Rate cards
│   │   ├── BalanceTrendChart.jsx # SVG line chart — monthly income vs expenses
│   │   ├── SpendingBreakdown.jsx # SVG donut chart — spending by category
│   │   └── RecentTransactions.jsx # Latest 6 transactions mini-feed
│   │
│   ├── transactions/
│   │   ├── TransactionsPage.jsx  # Full table with search, filter, sort, CSV export
│   │   └── AddTransactionModal.jsx # Add / Edit modal form (Admin only)
│   │
│   └── insights/
│       └── InsightsPage.jsx     # Key metrics, monthly bars, category breakdown, smart tips
│
├── context/
│   └── AppContext.jsx           # Global state via React Context
│
├── lib/
│   ├── mockData.js              # 38 realistic transactions + monthly summary data
│   └── utils.js                 # formatCurrency, formatDate, groupByCategory, getTotals
│
├── next.config.js
├── postcss.config.mjs
└── README.md
```

---

## ✨ Features

### 1. Dashboard Overview

- **4 Summary Cards** — Total Balance, Total Income, Total Expenses, Savings Rate — each with a contextual glow accent
- **Balance Trend Chart** — Pure SVG line chart showing monthly income vs expenses across 4 months with area fills and data point markers (no chart library needed)
- **Spending Breakdown** — Pure SVG donut chart showing top spending categories with a live legend
- **Recent Activity** — Latest 6 transactions with category color dots, quick-links to the full transactions page

### 2. Transactions Section

- Full sortable, filterable table of all transactions
- **Search** by description or category
- **Filter** by transaction type (Income / Expense) and by category
- **Sort** by: Newest, Oldest, Highest Amount, Lowest Amount
- **CSV Export** — downloads all currently filtered transactions as a `.csv` file
- Live result count updates as filters change
- Graceful empty state when no results match

### 3. Role-Based UI (RBAC Simulation)

Two roles are supported, switchable via the sidebar dropdown or by changing context:

| Feature | 👑 Admin | 👁 Viewer |
|---|---|---|
| View all data | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

No backend or authentication — role is stored in `localStorage` and applied purely on the frontend to demonstrate UI behaviour changes.

### 4. Insights Section

- **Top Spending Category** — highlighted with its category color
- **Savings Rate** — color-coded green (≥20%), amber (10–19%), red (<10%)
- **Average Expense** — per-transaction average across all expenses
- **Best Month** — month with the highest net savings
- **Monthly Comparison** — horizontal bar pairs (income vs expenses) for each month
- **Category Breakdown** — proportional progress bars for every expense category
- **Smart Observations** — 4 auto-generated text insights that respond to the actual data (savings rate warning, top category callout, income growth/drop detection, habit tip)

### 5. State Management

All state is managed through a single **React Context** (`AppContext`) — no external state library. State slices:

| State | Description |
|---|---|
| `transactions` | Full transaction list (add / edit / delete) |
| `role` | Current user role (`admin` or `viewer`) |
| `filters` | Search query, type filter, category filter, sort order |
| `activeTab` | Current page (`dashboard`, `transactions`, `insights`) |
| `darkMode` | Theme preference |

Everything persists to **localStorage** automatically — refreshing the page keeps your data, role, and theme intact.

### 6. Dark / Light Mode

- Toggle available in both the **Header** (animated pill switch) and the **Sidebar**
- Implemented via CSS custom properties scoped to `html` and `html.light`
- Smooth `0.3s` transition on all colour changes
- Preference saved to `localStorage` and restored on next visit

---

## 🎨 Design Decisions

**Typography:** `Syne` (display / headings) paired with `DM Mono` (numbers, labels, metadata) — chosen for their financial/editorial character over generic system fonts.

**Color system:** Deep dark-first palette (`#0a0a0f` base) with CSS variable tokens for every colour. A single accent (`#7c6af7` purple) with semantic colours for income (green `#22d37a`) and expenses (red `#f25c5c`). All colours swap cleanly in light mode via a single `html.light` class toggle.

**Charts without libraries:** Both the line chart and donut chart are hand-written SVG — keeping the bundle lean and giving full control over styling and animation.

**Zero-dependency charts:** No Recharts, Chart.js, or D3. Pure SVG paths and geometry calculated inline.

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.2 | React framework, App Router |
| React | 19.2.4 | UI library |
| Tailwind CSS | v4 | Utility classes + PostCSS pipeline |
| JavaScript / JSX | — | No TypeScript (as per requirements) |

No additional runtime dependencies beyond what ships with the project.

---

## 📊 Mock Data

38 realistic transactions spanning **January–April 2026** across 12 categories:

`Food & Dining` · `Transport` · `Shopping` · `Entertainment` · `Health` · `Utilities` · `Rent` · `Salary` · `Freelance` · `Investment` · `Education` · `Travel`

Monthly summary data for the trend chart covers Jan–Apr with realistic income/expense ratios. All data is editable at runtime via the Admin role and persists to localStorage.

---

## 🔧 Optional Enhancements Implemented

- ✅ **Dark / Light mode** with animated toggle
- ✅ **localStorage persistence** — transactions, role, theme all survive page refresh
- ✅ **CSV export** of filtered transactions
- ✅ **Animations** — `fadeUp` entrance animations, hover states, smooth theme transitions, animated donut chart, floating gradient blob

---

## 📝 Assumptions Made

- Authentication is out of scope — role switching is a UI-only demonstration
- All monetary values are in **Indian Rupees (₹)**, formatted with `en-IN` locale
- The "current date" shown in the header reflects the real system date at runtime
- No API integration — all data originates from `lib/mockData.js` and is managed in memory + localStorage