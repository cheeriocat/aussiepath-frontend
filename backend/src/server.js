/**
 * server.js — AussiePath Express API entry point.
 * On startup: opens the SQLite DB, runs schema creation, and seeds initial data.
 */
'use strict';

const express = require('express');
const cors    = require('cors');

// ── Database bootstrap (order matters) ───────────────────────────────────────
const { initSchema } = require('./database/schema');
const { seed }       = require('./database/seed');

initSchema();   // CREATE TABLE IF NOT EXISTS …
seed();         // Insert initial rows if tables are empty

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/auth');
const jobRoutes         = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const eligibilityRoutes = require('./routes/eligibility');
const statsRoutes       = require('./routes/stats');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Mount routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/eligibility',  eligibilityRoutes);
app.use('/api/stats',        statsRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'AussiePath API (SQLite) running', timestamp: new Date() });
});

// ── 404 ────────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀  AussiePath API (SQLite) → http://localhost:${PORT}`);
  console.log(`   Health check   → http://localhost:${PORT}/api/health\n`);
});
