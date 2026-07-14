/**
 * routes/applications.js — Full CRUD for the applications table.
 * Public:  POST /api/applications  (customer submits)
 * Admin:   GET, PUT, DELETE        (JWT required)
 */
'use strict';

const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const db       = require('../database/db');
const { parseApp } = require('../database/helpers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* ── GET /api/applications — admin only ────────────────────────────────────── */
router.get('/', authMiddleware, (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  const conditions = [];
  const params     = [];

  if (status && status !== 'All') {
    // Support partial matching e.g. "Documents" matches "Pending Documentation" too if needed
    conditions.push('LOWER(status) LIKE ?');
    params.push(`%${status.toLowerCase()}%`);
  }
  if (search) {
    conditions.push('(LOWER(applicant_name) LIKE ? OR LOWER(occupation) LIKE ? OR LOWER(email) LIKE ?)');
    const s = `%${search.toLowerCase()}%`;
    params.push(s, s, s);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total matching rows
  const total = db.prepare(`SELECT COUNT(*) AS c FROM applications ${where}`).get(...params).c;

  // Paginate
  const lim    = parseInt(limit);
  const offset = (parseInt(page) - 1) * lim;
  const rows   = db.prepare(
    `SELECT * FROM applications ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, lim, offset);

  res.json({
    success: true,
    total,
    page:  parseInt(page),
    limit: lim,
    data:  rows.map(parseApp),
  });
});

/* ── GET /api/applications/:id — admin only ────────────────────────────────── */
router.get('/:id', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Application not found' });
  res.json({ success: true, data: parseApp(row) });
});

/* ── POST /api/applications — public (customer submits) ────────────────────── */
router.post('/', (req, res) => {
  const { applicantName, email, phone, occupation, visaType, jobId, nationality, age } = req.body;
  if (!applicantName || !email || !occupation)
    return res.status(400).json({ success: false, message: 'applicantName, email and occupation are required' });

  const id  = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO applications
      (id, applicant_name, email, phone, occupation, visa_type, status,
       job_id, nationality, age, points, notes, documents, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending Documentation', ?, ?, ?, 0, '', '[]', ?)
  `).run(
    id, applicantName, email, phone || '',
    occupation, visaType || 'Skilled 482',
    jobId || null, nationality || '', parseInt(age) || 0, now
  );

  // Record an activity for this new application
  db.prepare(`
    INSERT INTO activities (id, user_name, role, avatar, action, time_ago, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(), applicantName, occupation,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(applicantName)}`,
    'Application submitted', 'Just now', now
  );

  const created = parseApp(db.prepare('SELECT * FROM applications WHERE id = ?').get(id));
  res.status(201).json({ success: true, data: created, message: 'Application submitted successfully!' });
});

/* ── PUT /api/applications/:id — admin only ────────────────────────────────── */
router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Application not found' });

  const { applicantName, email, phone, occupation, visaType, status, nationality, age, points, notes } = req.body;

  db.prepare(`
    UPDATE applications SET
      applicant_name = COALESCE(?, applicant_name),
      email          = COALESCE(?, email),
      phone          = COALESCE(?, phone),
      occupation     = COALESCE(?, occupation),
      visa_type      = COALESCE(?, visa_type),
      status         = COALESCE(?, status),
      nationality    = COALESCE(?, nationality),
      age            = COALESCE(?, age),
      points         = COALESCE(?, points),
      notes          = COALESCE(?, notes)
    WHERE id = ?
  `).run(
    applicantName || null, email || null, phone || null,
    occupation    || null, visaType || null, status || null,
    nationality   || null,
    age     !== undefined ? parseInt(age)    : null,
    points  !== undefined ? parseInt(points) : null,
    notes || null,
    req.params.id
  );

  const updated = parseApp(db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id));
  res.json({ success: true, data: updated });
});

/* ── DELETE /api/applications/:id — admin only ─────────────────────────────── */
router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Application not found' });

  db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Application deleted successfully' });
});

/* ── GET /api/applications/export/csv — admin only ────────────────────────── */
router.get('/export/csv', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all().map(parseApp);

  const header = 'ID,Name,Email,Phone,Occupation,Visa Type,Status,Nationality,Age,Points,Created At\n';
  const body   = rows.map(r =>
    [r.id, `"${r.applicantName}"`, r.email, r.phone, `"${r.occupation}"`,
     r.visaType, r.status, r.nationality, r.age, r.points, r.createdAt].join(',')
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
  res.send(header + body);
});

module.exports = router;
