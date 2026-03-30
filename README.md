 🚀 Smart Job Tracker Dashboard

A production-grade React SaaS dashboard to track job applications — built with real API calls, full CRUD, analytics.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar/          # Sidebar navigation
│   ├── JobCard/         # Card + Table row + CompanyLogo + StatusBadge
│   ├── SearchBar/       # Debounced search input
│   ├── Filters/         # Status / Platform / Location dropdowns + Sort
│   └── Charts/          # Recharts: Pie, Bar, Area, Stacked charts
│
├── pages/
│   ├── Dashboard/       # Stats + Recent apps + Upcoming interviews
│   ├── Applications/    # Table/Grid view with Search + Filter + Tabs
│   ├── AddApplication/  # react-hook-form + Yup validation form
│   ├── EditApplication/ # Pre-filled edit form
│   ├── Analytics/       # Deep charts + KPIs
│   └── Bookmarks/       # Saved/bookmarked jobs
│
├── context/
│   └── ApplicationContext.jsx   # Global state (Context API)
│
├── hooks/
│   ├── useApplications.js       # Context consumer hook
│   ├── useDebounce.js           # Debounce search hook
│   └── useLocalStorage.js       # Persist state to localStorage
│
├── services/
│   └── api.js                   # Axios calls: dummyjson + clearbit
│
└── utils/
    └── helpers.js               # fmtSalary, fmtDate, domainOf, constants
```

---

## ⚙️ Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
http://localhost:3000
```

---

## 🌐 APIs Used

| API | Purpose |
|-----|---------|
| `https://dummyjson.com/products` | Mock job listings (Axios GET) |
| `https://logo.clearbit.com/{domain}` | Company logos |

---

## 📦 Key Packages

| Package | Usage |
|---------|-------|
| `react-router-dom` | Client-side routing (5 pages) |
| `axios` | HTTP requests to dummyjson API |
| `react-hook-form` | Form state management |
| `yup` + `@hookform/resolvers` | Form validation schema |
| `recharts` | Pie, Bar, Area charts |
| `react-toastify` | Toast notifications |
| `react-icons` | Icon library |
| `date-fns` | Date formatting |
| `framer-motion` | Animations (available for extension) |

---

## ✅ Features Implemented

- [x] **Add Application** — react-hook-form + Yup validation (9 fields)
- [x] **Edit / Delete** — pre-filled form, confirm delete
- [x] **Applications List** — Table + Grid card view
- [x] **Search** — debounced (400ms) by company + role
- [x] **Filters** — Status, Platform, Location type
- [x] **Sort** — by Date, Salary, Company name
- [x] **Pipeline Tabs** — All / Applied / Interviewing / Offer / Rejected
- [x] **Bookmarks** — toggle + dedicated bookmarks page
- [x] **Dashboard** — 4 stat cards + charts + upcoming interviews
- [x] **Analytics** — KPIs, Pie, Bar, Platform breakdown, Stacked chart
- [x] **API Call** — dummyjson products → mapped to job data model
- [x] **Company Logos** — Clearbit logo API with letter fallback
- [x] **LocalStorage** — data persists on refresh
- [x] **React Context** — global state (add/update/delete/bookmark)
- [x] **Custom Hooks** — useApplications, useDebounce, useLocalStorage
- [x] **Responsive** — mobile sidebar + stacked layout
- [x] **Toast Notifications** — all CRUD actions

---

## 🏗 Data Model

```js
{
  id:            string,      // uid()
  company:       string,      // "Google"
  role:          string,      // "Frontend Engineer"
  location:      string,      // "Remote" | "On-site" | "Hybrid"
  salary:        number,      // 1500000 (INR per year)
  platform:      string,      // "LinkedIn"
  status:        string,      // "Applied" | "Interviewing" | "Offer" | "Rejected"
  appliedDate:   string,      // "2026-03-15"
  interviewDate: string,      // "2026-03-28" | ""
  notes:         string,      // free text
  bookmarked:    boolean,
  _fromApi:      boolean,     // true if loaded from dummyjson
}
```

---
