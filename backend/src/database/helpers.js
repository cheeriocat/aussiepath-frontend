/**
 * helpers.js — DB row → API-friendly object transformers.
 * SQLite returns column names as-is (snake_case).
 * These helpers parse JSON fields and camelCase-ify the keys.
 */
'use strict';

const safe = (str, fallback = []) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

/** Transform a jobs row from SQLite → JS object */
function parseJob(row) {
  if (!row) return null;
  return {
    id:           row.id,
    title:        row.title,
    company:      row.company,
    companyLogo:  row.company_logo,
    location:     row.location,
    type:         row.type,
    salary:       row.salary,
    salaryNum:    row.salary_num,
    description:  row.description,
    requirements: safe(row.requirements),
    skills:       safe(row.skills),
    visaTypes:    safe(row.visa_types),
    postedAt:     row.posted_at,
    featured:     Boolean(row.featured),
    active:       Boolean(row.active),
  };
}

/** Transform an applications row from SQLite → JS object */
function parseApp(row) {
  if (!row) return null;
  return {
    id:            row.id,
    applicantName: row.applicant_name,
    email:         row.email,
    phone:         row.phone,
    occupation:    row.occupation,
    visaType:      row.visa_type,
    status:        row.status,
    jobId:         row.job_id,
    nationality:   row.nationality,
    age:           row.age,
    points:        row.points,
    notes:         row.notes,
    documents:     safe(row.documents),
    createdAt:     row.created_at,
  };
}

/** Transform an activities row from SQLite → JS object */
function parseActivity(row) {
  if (!row) return null;
  return {
    id:        row.id,
    userName:  row.user_name,
    role:      row.role,
    avatar:    row.avatar,
    action:    row.action,
    time:      row.time_ago,
    createdAt: row.created_at,
  };
}

module.exports = { parseJob, parseApp, parseActivity };
