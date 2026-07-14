/**
 * routes/eligibility.js — Australian points test calculator.
 * Saves every check to the eligibility_checks table for audit/analytics.
 */
'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ── Scoring tables ─────────────────────────────────────────────────────────────
const OCCUPATION_POINTS = 60;

const agePoints = age => {
  const a = parseInt(age) || 0;
  if (a >= 18 && a <= 24) return 25;
  if (a >= 25 && a <= 32) return 30;
  if (a >= 33 && a <= 39) return 25;
  if (a >= 40 && a <= 44) return 15;
  return 0;
};

const englishPoints = level => (
  { 'Competent': 0, 'Proficient': 10, 'Superior': 20 }[level] ?? 0
);

const experiencePoints = yrs => {
  const y = parseInt(yrs) || 0;
  if (y >= 8) return 20;
  if (y >= 5) return 15;
  if (y >= 3) return 10;
  if (y >= 1) return 5;
  return 0;
};

const qualificationPoints = qual => (
  { 'Doctorate': 20, "Master's Degree": 15, "Bachelor's Degree": 15, 'Diploma': 10, 'Trade Qualification': 10 }[qual] ?? 0
);

/* ── POST /api/eligibility/check — public ─────────────────────────────────── */
router.post('/check', (req, res) => {
  const { occupation, englishLevel, yearsOfExperience, qualification, age,
          partnerSkills, australianStudy, regionalStudy } = req.body;

  if (!occupation || !englishLevel || !yearsOfExperience || !qualification)
    return res.status(400).json({ success: false, message: 'occupation, englishLevel, yearsOfExperience and qualification are required' });

  const agePts        = agePoints(age);
  const engPts        = englishPoints(englishLevel);
  const expPts        = experiencePoints(yearsOfExperience);
  const qualPts       = qualificationPoints(qualification);
  const partnerPts    = partnerSkills     ? 10 : 0;
  const studyPts      = australianStudy   ? 5  : 0;
  const regionalPts   = regionalStudy     ? 5  : 0;

  const total   = OCCUPATION_POINTS + agePts + engPts + expPts + qualPts + partnerPts + studyPts + regionalPts;
  const eligible = total >= 65;

  const breakdown = [
    { category: 'Skilled Occupation',     points: OCCUPATION_POINTS },
    { category: 'Age',                    points: agePts    },
    { category: 'English Language',       points: engPts    },
    { category: 'Work Experience',        points: expPts    },
    { category: 'Educational Qualification', points: qualPts },
    { category: 'Partner Skills',         points: partnerPts  },
    { category: 'Australian Study',       points: studyPts    },
    { category: 'Regional Study',         points: regionalPts },
  ];

  const message = eligible
    ? `Congratulations! Your score of ${total} points meets the 65-point threshold for skilled migration.`
    : `Your current score of ${total} points is below the 65-point threshold. Improving English or gaining more experience can help.`;

  // ── Persist audit record to DB ─────────────────────────────────────────────
  try {
    db.prepare(`
      INSERT INTO eligibility_checks
        (id, occupation, english_level, years_of_experience, qualification, age, total_points, eligible, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(), occupation, englishLevel, parseInt(yearsOfExperience) || 0,
      qualification, parseInt(age) || 0, total, eligible ? 1 : 0,
      new Date().toISOString()
    );
  } catch (err) {
    console.warn('Could not save eligibility check:', err.message);
  }

  res.json({ success: true, data: { total, eligible, message, breakdown } });
});

/* ── GET /api/eligibility/history — admin only ────────────────────────────── */
router.get('/history', authMiddleware, (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const lim    = parseInt(limit);
  const offset = (parseInt(page) - 1) * lim;
  const total  = db.prepare('SELECT COUNT(*) AS c FROM eligibility_checks').get().c;
  const rows   = db.prepare(
    'SELECT * FROM eligibility_checks ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(lim, offset);

  res.json({ success: true, total, data: rows });
});

/* ── GET /api/eligibility/stats — admin only ──────────────────────────────── */
router.get('/stats', authMiddleware, (_req, res) => {
  const total   = db.prepare('SELECT COUNT(*) AS c FROM eligibility_checks').get().c;
  const eligible = db.prepare('SELECT COUNT(*) AS c FROM eligibility_checks WHERE eligible = 1').get().c;
  const avgScore = db.prepare('SELECT AVG(total_points) AS avg FROM eligibility_checks').get().avg;

  const byOccupation = db.prepare(`
    SELECT occupation, COUNT(*) AS count, AVG(total_points) AS avg_points
    FROM eligibility_checks
    GROUP BY occupation
    ORDER BY count DESC
    LIMIT 10
  `).all();

  res.json({
    success: true,
    data: {
      totalChecks:     total,
      eligibleCount:   eligible,
      ineligibleCount: total - eligible,
      eligibilityRate: total > 0 ? Math.round((eligible / total) * 100) : 0,
      averageScore:    avgScore ? Math.round(avgScore) : 0,
      byOccupation,
    },
  });
});

module.exports = router;
