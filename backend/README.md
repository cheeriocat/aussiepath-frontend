# ⚙️ AussiePath — Database API Server (Node & SQLite)

This repository hosts the backend REST API engine for the AussiePath Visa Consultancy platform. It handles authentication, jobs listings, application flow tracking, metrics gathering, and points-test audits.

---

## 🗄️ Database Architecture (SQLite)

The backend uses Node's native **`node:sqlite` (DatabaseSync)** engine introduced in Node 22. This eliminates compiler warnings and native C++ builds (`node-gyp`) on host servers while delivering WAL-mode speeds.

### Database Tables:
1. **`users`**: Relates authenticated accounts. Includes standard password hashing (`bcryptjs`) and roles (`admin` or `customer`).
2. **`jobs`**: Job postings containing compressed JSON arrays for listing requirements, skills, and visa types.
3. **`applications`**: Visa applicant filings linked to `jobs` via Foreign Keys.
4. **`activities`**: Event logs for the Admin Dashboard activity stream.
5. **`eligibility_checks`**: Logs every points-test calculation for audit and dashboard success rate metrics.

---

## 🛠️ CLI Tools & Scripts

Register commands inside `package.json`:

* **`npm run dev`**: Starts the Express server using `nodemon` for auto-restarts on save.
* **`npm run seed`**: Seeds the database from scratch (populates sample jobs, admins, and candidates).
* **`npm run db:shell`**: Launches a custom, interactive SQLite command-line tool directly in your terminal to query tables manually.
* **`npm run db:reset`**: Deletes the local SQLite database file to prepare for a clean migration.

---

## 🚀 Getting Started

### 1. Installation
Install dependencies:
```bash
npm install
```

### 2. Seeding & Database Boot
Build the tables and populate sample records:
```bash
npm run seed
```

### 3. Start Development Server
Launches API on `http://localhost:5000`:
```bash
npm run dev
```

