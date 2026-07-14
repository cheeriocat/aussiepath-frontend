/**
 * shell.js — A simple interactive SQLite command-line tool.
 * Allows you to query and manage the database directly from the terminal.
 * Run with: npm run db:shell
 */
'use strict';

const readline = require('readline');
const db       = require('./db');

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
  prompt: 'aussiepath-sqlite> '
});

console.log('========================================================');
console.log('   AussiePath SQLite Interactive Console');
console.log('   Type any SQL command (e.g. SELECT * FROM users;)');
console.log('   Type ".exit" to quit');
console.log('========================================================\n');

rl.prompt();

rl.on('line', (line) => {
  const query = line.trim();
  if (query === '.exit' || query === 'exit') {
    rl.close();
    return;
  }
  if (!query) {
    rl.prompt();
    return;
  }

  // Ensure statements end with semicolon optional, but clean up trailing one
  const sql = query.endsWith(';') ? query.slice(0, -1) : query;

  try {
    const isQuery = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(sql);
    if (isQuery) {
      const stmt = db.prepare(sql);
      const rows = stmt.all();
      if (rows.length === 0) {
        console.log('(No rows returned)');
      } else {
        console.table(rows);
      }
    } else {
      const stmt = db.prepare(sql);
      const info = stmt.run();
      console.log('Operation completed successfully.');
      console.log(info);
    }
  } catch (err) {
    console.error('❌ SQL Error:', err.message);
  }

  console.log(); // blank line
  rl.prompt();
}).on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
