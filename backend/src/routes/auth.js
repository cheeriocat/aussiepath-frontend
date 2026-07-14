/**
 * routes/auth.js — Authentication against the SQLite users table (admins & customers).
 */
'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db      = require('../database/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

/* ── POST /api/auth/register ───────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });

  try {
    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing)
      return res.status(400).json({ success: false, message: 'Email address already registered' });

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'customer'; // Default is customer
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, hashedPassword, userRole, avatar, now);

    const createdUser = { id, name, email, role: userRole, avatar };
    
    const token = jwt.sign(
      { id, email, name, role: userRole },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: createdUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/auth/login ──────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: {
      id:     user.id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
    },
  });
});

/* ── POST /api/auth/verify ─────────────────────────────────────────────────── */
router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

/* ── GET /api/auth/users  (list all users — admin only) ────────────────────── */
const { authMiddleware } = require('../middleware/authMiddleware');
router.get('/users', authMiddleware, (_req, res) => {
  const users = db.prepare('SELECT id, name, email, role, avatar, created_at FROM users').all();
  res.json({ success: true, data: users });
});

module.exports = router;
