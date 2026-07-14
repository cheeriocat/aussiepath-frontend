/**
 * db.js — Singleton SQLite connection via node:sqlite (native Node 22 SQLite driver)
 * The database file lives at  backend/data/aussiepath.db
 */
'use strict';

const { DatabaseSync } = require('node:sqlite');
const path             = require('path');
const fs               = require('fs');

// ── Ensure the data directory exists ──────────────────────────────────────────
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'aussiepath.db');

// ── Open (or create) the database ─────────────────────────────────────────────
const db = new DatabaseSync(DB_PATH);

// ── PRAGMAs for better performance and data integrity ─────────────────────────
db.exec('PRAGMA journal_mode = WAL');   // Write-Ahead Logging — much faster for concurrent reads
db.exec('PRAGMA foreign_keys = ON');    // Enforce FK constraints
db.exec('PRAGMA synchronous   = NORMAL'); // Faster writes, still safe with WAL

// ── Custom Transaction Wrapper ────────────────────────────────────────────────
db.transaction = (fn) => {
  return (...args) => {
    db.exec('BEGIN TRANSACTION');
    try {
      const result = fn(...args);
      db.exec('COMMIT');
      return result;
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  };
};

console.log(`📂  SQLite database: ${DB_PATH}`);

module.exports = db;
