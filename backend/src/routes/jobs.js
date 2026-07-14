/**
 * routes/jobs.js — Full CRUD for the jobs table.
 * Public:  GET /api/jobs, GET /api/jobs/:id
 * Admin:   POST, PUT, DELETE  (JWT required)
 */
'use strict';

const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const db       = require('../database/db');
const { parseJob } = require('../database/helpers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* ── GET /api/jobs ─────────────────────────────────────────────────────────── */
router.get('/', (req, res) => {
  const { search, location, type, featured, limit, page = 1 } = req.query;

  // Build SQL dynamically
  const conditions = [];
  const params     = [];

  if (search) {
    conditions.push('(LOWER(title) LIKE ? OR LOWER(company) LIKE ?)');
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
  }
  if (location) {
    conditions.push('LOWER(location) LIKE ?');
    params.push(`%${location.toLowerCase()}%`);
  }
  if (type) {
    conditions.push('LOWER(type) = ?');
    params.push(type.toLowerCase());
  }
  if (featured === 'true') {
    conditions.push('featured = 1');
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total
  const totalRow = db.prepare(`SELECT COUNT(*) AS c FROM jobs ${where}`).get(...params);
  const total    = totalRow.c;

  // Pagination
  let sql = `SELECT * FROM jobs ${where} ORDER BY posted_at DESC`;
  if (limit) {
    const lim  = parseInt(limit);
    const off  = (parseInt(page) - 1) * lim;
    sql += ` LIMIT ${lim} OFFSET ${off}`;
  }

  const rows = db.prepare(sql).all(...params);
  res.json({ success: true, total, count: rows.length, data: rows.map(parseJob) });
});

/* ── GET /api/jobs/:id ─────────────────────────────────────────────────────── */
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: parseJob(row) });
});

/* ── POST /api/jobs — admin only ───────────────────────────────────────────── */
router.post('/', authMiddleware, (req, res) => {
  const { title, company, location, type, salary, description, requirements, skills, visaTypes, featured } = req.body;
  if (!title || !company || !location)
    return res.status(400).json({ success: false, message: 'title, company and location are required' });

  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO jobs
      (id, title, company, company_logo, location, type, salary, salary_num,
       description, requirements, skills, visa_types, posted_at, featured, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    id, title, company,
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company)}&backgroundColor=0d6efd`,
    location, type || 'Full Time', salary || 'Competitive', 0,
    description || '',
    JSON.stringify(Array.isArray(requirements) ? requirements : []),
    JSON.stringify(Array.isArray(skills)       ? skills       : []),
    JSON.stringify(Array.isArray(visaTypes)    ? visaTypes    : []),
    now, featured ? 1 : 0
  );

  const created = parseJob(db.prepare('SELECT * FROM jobs WHERE id = ?').get(id));
  res.status(201).json({ success: true, data: created });
});

/* ── PUT /api/jobs/:id — admin only ────────────────────────────────────────── */
router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Job not found' });

  const { title, company, location, type, salary, description, requirements, skills, visaTypes, featured, active } = req.body;

  db.prepare(`
    UPDATE jobs SET
      title        = COALESCE(?, title),
      company      = COALESCE(?, company),
      location     = COALESCE(?, location),
      type         = COALESCE(?, type),
      salary       = COALESCE(?, salary),
      description  = COALESCE(?, description),
      requirements = COALESCE(?, requirements),
      skills       = COALESCE(?, skills),
      visa_types   = COALESCE(?, visa_types),
      featured     = COALESCE(?, featured),
      active       = COALESCE(?, active)
    WHERE id = ?
  `).run(
    title || null, company || null, location || null, type || null,
    salary || null, description || null,
    requirements !== undefined ? JSON.stringify(requirements) : null,
    skills       !== undefined ? JSON.stringify(skills)       : null,
    visaTypes    !== undefined ? JSON.stringify(visaTypes)    : null,
    featured     !== undefined ? (featured ? 1 : 0)          : null,
    active       !== undefined ? (active   ? 1 : 0)          : null,
    req.params.id
  );

  const updated = parseJob(db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id));
  res.json({ success: true, data: updated });
});

/* ── DELETE /api/jobs/:id — admin only ─────────────────────────────────────── */
router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM jobs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Job not found' });

  // Nullify job_id in linked applications before deleting
  db.prepare('UPDATE applications SET job_id = NULL WHERE job_id = ?').run(req.params.id);
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);

  res.json({ success: true, message: 'Job deleted successfully' });
});

module.exports = router;
