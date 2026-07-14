/**
 * routes/stats.js — Dashboard statistics drawn directly from SQLite.
 * All numbers are real counts from the database, not hardcoded values.
 */
'use strict';

const express = require('express');
const db      = require('../database/db');
const { parseActivity } = require('../database/helpers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* ── GET /api/stats — admin only ───────────────────────────────────────────── */
router.get('/', authMiddleware, (_req, res) => {
  // Real counts from DB
  const totalApplicants = db.prepare('SELECT COUNT(*) AS c FROM applications').get().c;
  const pendingFiles    = db.prepare(
    "SELECT COUNT(*) AS c FROM applications WHERE status IN ('Pending Documentation', 'Documents')"
  ).get().c;
  const activeJobs      = db.prepare('SELECT COUNT(*) AS c FROM jobs WHERE active = 1').get().c;
  const successCases    = db.prepare('SELECT COUNT(*) AS c FROM eligibility_checks WHERE eligible = 1').get().c;

  // Status breakdown
  const statusBreakdown = db.prepare(`
    SELECT status, COUNT(*) AS count
    FROM applications
    GROUP BY status
    ORDER BY count DESC
  `).all();

  // Applications by month (last 6 months)
  const monthlyApps = db.prepare(`
    SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count
    FROM applications
    WHERE created_at >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC
  `).all();

  // Top occupations
  const topOccupations = db.prepare(`
    SELECT occupation, COUNT(*) AS count
    FROM applications
    GROUP BY occupation
    ORDER BY count DESC
    LIMIT 5
  `).all();

  // Visa type breakdown
  const visaBreakdown = db.prepare(`
    SELECT visa_type, COUNT(*) AS count
    FROM applications
    GROUP BY visa_type
    ORDER BY count DESC
  `).all();

  // Points distribution (average)
  const avgPoints = db.prepare('SELECT AVG(points) AS avg FROM applications WHERE points > 0').get().avg;

  res.json({
    success: true,
    data: {
      totalApplicants,
      pendingFiles,
      activeJobs,
      successCases,
      statusBreakdown,
      monthlyApps,
      topOccupations,
      visaBreakdown,
      averagePoints: avgPoints ? Math.round(avgPoints) : 0,
    },
  });
});

/* ── GET /api/stats/activity — admin only ──────────────────────────────────── */
router.get('/activity', authMiddleware, (req, res) => {
  const { limit = 10 } = req.query;
  const rows = db.prepare(
    'SELECT * FROM activities ORDER BY created_at DESC LIMIT ?'
  ).all(parseInt(limit));

  res.json({ success: true, data: rows.map(parseActivity) });
});

/* ── GET /api/stats/jobs — admin only ─────────────────────────────────────── */
router.get('/jobs', authMiddleware, (_req, res) => {
  const total    = db.prepare('SELECT COUNT(*) AS c FROM jobs').get().c;
  const active   = db.prepare('SELECT COUNT(*) AS c FROM jobs WHERE active = 1').get().c;
  const featured = db.prepare('SELECT COUNT(*) AS c FROM jobs WHERE featured = 1').get().c;

  const byLocation = db.prepare(`
    SELECT location, COUNT(*) AS count
    FROM jobs
    WHERE active = 1
    GROUP BY location
    ORDER BY count DESC
  `).all();

  const byType = db.prepare(`
    SELECT type, COUNT(*) AS count
    FROM jobs
    WHERE active = 1
    GROUP BY type
    ORDER BY count DESC
  `).all();

  res.json({ success: true, data: { total, active, featured, byLocation, byType } });
});

module.exports = router;
