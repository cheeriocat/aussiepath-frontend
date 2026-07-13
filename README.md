# 🇦🇺 AussiePath — Frontend Applications (Customer Portal & Admin Panel)

AussiePath is a premium, professional visa consultancy platform matching skilled global professionals with Australian career opportunities and points-based visa eligibility tests.

This repository hosts both front-end applications built with **React** and **Vite**:
1. **Customer Portal** (Port 3000): For candidates searching for jobs, calculating points, and submitting applications.
2. **Admin Panel** (Port 3001): For migration agents managing listings, candidate status cards, and dashboard metrics.

---

## 🎨 Design & Key Features

* **Cinematic Light/Dark Switcher**: Fully transitions backgrounds, cards, typography, tables, and borders over a soft `0.8s` curve using CSS variables.
* **Expanding Search Inputs**: Dynamic focus inputs in both headers that expand dynamically with fluid easing:
  * Customer search: `200px` ➜ `320px`
  * Admin search: `260px` ➜ `380px`
* **Responsive Points Calculator**: A quick points test calculating criteria for subclasses 189, 190, and 491.
* **Role-Based Access Control (RBAC)**: Hides the Admin navigation link from customer-level users; instantly unlocks it only if an authenticated administrator signs in.

---

## 🛠️ Tech Stack & Directory Structure

```
├── customer-frontend/   # React/Vite app for customers (localhost:3000)
└── admin-frontend/      # React/Vite dashboard app for admins (localhost:3001)
```

* **Build Core**: React 18, Vite 5, React Router DOM.
* **Icons**: `react-icons` (Feather & Remix icons).
* **Styling**: Premium, responsive Vanilla CSS variables (supporting contrast theme states).

---

## 🚀 Getting Started (Local Run)

### 1. Installation
Install modules in both folders:
```bash
# Customer Frontend
cd customer-frontend
npm install

# Admin Panel
cd ../admin-frontend
npm install
```

### 2. Development Servers
Launch local servers in separate terminals:
```bash
# Customer Portal (Runs on http://localhost:3000)
cd customer-frontend
npm run dev

# Admin Panel (Runs on http://localhost:3001)
cd ../admin-frontend
npm run dev
```

### 3. Production Build
Verify typescript/react compilation and optimize assets:
```bash
npm run build
```

---

## ☁️ Deploying to Vercel (Monorepo Setup)

This repository is monorepo-friendly. To host both frontends on **Vercel**:

### Deploy the Customer Portal:
1. Import this repository into Vercel.
2. In configurations, select **Vite** preset.
3. Edit the **Root Directory** setting and specify `customer-frontend`.
4. Click **Deploy**.

### Deploy the Admin Panel:
1. Import this repository as a second project.
2. In configurations, select **Vite** preset.
3. Edit the **Root Directory** setting and specify `admin-frontend`.
4. Click **Deploy**.
