/**
 * schema.js — Creates all SQLite tables if they do not yet exist.
 * Safe to call on every startup (uses IF NOT EXISTS).
 */
'use strict';

const db = require('./db');

function initSchema() {
  db.exec(`
    /* ── Users ──────────────────────────────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      role       TEXT NOT NULL DEFAULT 'customer',
      avatar     TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );

    /* ── Jobs ───────────────────────────────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS jobs (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      company      TEXT NOT NULL,
      company_logo TEXT,
      location     TEXT NOT NULL,
      type         TEXT NOT NULL DEFAULT 'Full Time',
      salary       TEXT,
      salary_num   INTEGER DEFAULT 0,
      description  TEXT,
      requirements TEXT NOT NULL DEFAULT '[]',   -- JSON array
      skills       TEXT NOT NULL DEFAULT '[]',   -- JSON array
      visa_types   TEXT NOT NULL DEFAULT '[]',   -- JSON array
      posted_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
      featured     INTEGER NOT NULL DEFAULT 0,   -- 0 | 1
      active       INTEGER NOT NULL DEFAULT 1    -- 0 | 1
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
    CREATE INDEX IF NOT EXISTS idx_jobs_active   ON jobs(active);
    CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);

    /* ── Applications ───────────────────────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS applications (
      id             TEXT PRIMARY KEY,
      applicant_name TEXT NOT NULL,
      email          TEXT NOT NULL,
      phone          TEXT DEFAULT '',
      occupation     TEXT NOT NULL,
      visa_type      TEXT NOT NULL DEFAULT 'Skilled 482',
      status         TEXT NOT NULL DEFAULT 'Pending Documentation',
      job_id         TEXT,
      nationality    TEXT DEFAULT '',
      age            INTEGER DEFAULT 0,
      points         INTEGER DEFAULT 0,
      notes          TEXT DEFAULT '',
      documents      TEXT NOT NULL DEFAULT '[]',  -- JSON array
      created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_apps_status     ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_apps_email      ON applications(email);
    CREATE INDEX IF NOT EXISTS idx_apps_created_at ON applications(created_at);

    /* ── Activities ─────────────────────────────────────────────────────── */
    CREATE TABLE IF NOT EXISTS activities (
      id         TEXT PRIMARY KEY,
      user_name  TEXT NOT NULL,
      role       TEXT DEFAULT '',
      avatar     TEXT DEFAULT '',
      action     TEXT DEFAULT '',
      time_ago   TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );

    /* ── Eligibility Checks (audit trail) ───────────────────────────────── */
    CREATE TABLE IF NOT EXISTS eligibility_checks (
      id                  TEXT PRIMARY KEY,
      occupation          TEXT,
      english_level       TEXT,
      years_of_experience INTEGER,
      qualification       TEXT,
      age                 INTEGER,
      total_points        INTEGER,
      eligible            INTEGER DEFAULT 0,
      created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );
  `);

  console.log('✅  Schema ready (all tables exist)');
}

module.exports = { initSchema };
