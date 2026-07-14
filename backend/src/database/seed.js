/**
 * seed.js — Populates the database with initial data on first run.
 * Checks whether data already exists before inserting (idempotent).
 */
'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt         = require('bcryptjs');
const db             = require('./db');
const { initSchema } = require('./schema');

// ── Helpers ────────────────────────────────────────────────────────────────────
const j  = v => JSON.stringify(v);     // array → JSON string
const now = () => new Date().toISOString();

function seed() {
  // Always ensure the schema is in place first
  initSchema();

  /* ──────────────────────────────────────────────────────────────────────────
   * USERS (Admins & Customers)
   * ──────────────────────────────────────────────────────────────────────── */
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      {
        id:       uuidv4(),
        name:     'Admin User',
        email:    'admin@aussiepath.com.au',
        password: bcrypt.hashSync('admin123', 10),
        role:     'admin',
        avatar:   'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser',
        created_at: now(),
      },
      {
        id:       uuidv4(),
        name:     'John Customer',
        email:    'customer@email.com',
        password: bcrypt.hashSync('customer123', 10),
        role:     'customer',
        avatar:   'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnCustomer',
        created_at: now(),
      },
    ];

    const insertMany = db.transaction(rows => rows.forEach(r =>
      insertUser.run(r.id, r.name, r.email, r.password, r.role, r.avatar, r.created_at)));
    insertMany(users);
    console.log(`  ✔  Seeded ${users.length} user(s)`);
  }

  /* ──────────────────────────────────────────────────────────────────────────
   * JOBS
   * ──────────────────────────────────────────────────────────────────────── */
  const jobCount = db.prepare('SELECT COUNT(*) AS c FROM jobs').get().c;
  if (jobCount === 0) {
    const insertJob = db.prepare(`
      INSERT INTO jobs
        (id, title, company, company_logo, location, type, salary, salary_num,
         description, requirements, skills, visa_types, posted_at, featured, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const jobs = [
      {
        id:           'job-001',
        title:        'Registered Nurse',
        company:      'HealthCare NSW',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HN&backgroundColor=0d6efd',
        location:     'Melbourne, VIC',
        type:         'Full Time',
        salary:       '$85,000 – $95,000',
        salary_num:   90000,
        description:  'We are seeking experienced Registered Nurses to join our leading healthcare network across Victoria. Deliver high-quality patient care in a supportive, multidisciplinary environment.',
        requirements: j(['AHPRA Registration', '2+ years clinical experience', 'BLS/CPR certification']),
        skills:       j(['Patient Care', 'Critical Thinking', 'Clinical Assessment']),
        visa_types:   j(['482', '186']),
        posted_at:    '2026-06-10T00:00:00.000Z',
        featured:     1,
        active:       1,
      },
      {
        id:           'job-002',
        title:        'Software Engineer',
        company:      'Amazon Australia',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AA&backgroundColor=ff9900',
        location:     'Sydney, NSW',
        type:         'Full Time',
        salary:       '$120,000 – $150,000',
        salary_num:   135000,
        description:  "Join Amazon's world-class engineering team to build systems that power millions of customers. You'll work on cutting-edge distributed systems, microservices, and cloud infrastructure.",
        requirements: j(['5+ years software experience', 'Strong JavaScript / Python', 'AWS knowledge']),
        skills:       j(['JavaScript', 'Cloud', 'AWS', 'Distributed Systems']),
        visa_types:   j(['482', '186', '189']),
        posted_at:    '2026-06-08T00:00:00.000Z',
        featured:     1,
        active:       1,
      },
      {
        id:           'job-003',
        title:        'Civil Project Manager',
        company:      'Lendlease Group',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LL&backgroundColor=28a745',
        location:     'Perth, WA',
        type:         'Full Time',
        salary:       '$130,000 – $160,000',
        salary_num:   145000,
        description:  'Lead large-scale civil infrastructure projects across Western Australia. Manage multimillion-dollar project budgets, contractors, and tight delivery schedules.',
        requirements: j(['10+ years civil engineering', 'PMP certification', 'NEC contract experience']),
        skills:       j(['Project Management', 'Civil Engineering', 'Budgeting', 'Stakeholder Management']),
        visa_types:   j(['482', '186']),
        posted_at:    '2026-06-05T00:00:00.000Z',
        featured:     1,
        active:       1,
      },
      {
        id:           'job-004',
        title:        'ICU Registered Nurse',
        company:      'Queensland Health',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=QH&backgroundColor=6f42c1',
        location:     'Brisbane, QLD',
        type:         'Full Time',
        salary:       '$90,000 – $105,000',
        salary_num:   97500,
        description:  'Queensland Health is seeking ICU Registered Nurses to deliver specialist care in our state-of-the-art intensive care units.',
        requirements: j(['AHPRA Registration', 'ICU/Critical Care experience', 'BLS/ACLS certification']),
        skills:       j(['ICU Care', 'Patient Safety', 'Ventilator Management']),
        visa_types:   j(['482', '186']),
        posted_at:    '2026-06-12T00:00:00.000Z',
        featured:     0,
        active:       1,
      },
      {
        id:           'job-005',
        title:        'Senior Digital Designer',
        company:      'Canva',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CV&backgroundColor=00c4cc',
        location:     'Sydney, NSW',
        type:         'Full Time',
        salary:       '$110,000 – $135,000',
        salary_num:   122500,
        description:  'Canva is looking for a Senior Digital Designer to craft world-class visual experiences used by millions globally.',
        requirements: j(['6+ years UI/UX experience', 'Figma proficiency', 'Portfolio of shipped products']),
        skills:       j(['UI/UX', 'Figma', 'Branding', 'Design Systems']),
        visa_types:   j(['189', '190', '482']),
        posted_at:    '2026-06-15T00:00:00.000Z',
        featured:     0,
        active:       1,
      },
      {
        id:           'job-006',
        title:        'Structural Engineer',
        company:      'AECOM Australia',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AE&backgroundColor=dc3545',
        location:     'Melbourne, VIC',
        type:         'Full Time',
        salary:       '$115,000 – $140,000',
        salary_num:   127500,
        description:  'AECOM is seeking a Structural Engineer for complex infrastructure and building projects across Australia.',
        requirements: j(['Engineers Australia eligibility', 'RPEQ or CPEng preferred', '7+ years structural experience']),
        skills:       j(['Structural Analysis', 'AutoCAD', 'Revit', 'ETABS']),
        visa_types:   j(['186', '482']),
        posted_at:    '2026-06-18T00:00:00.000Z',
        featured:     0,
        active:       1,
      },
      {
        id:           'job-007',
        title:        'General Practitioner',
        company:      'MedHealth Group',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MH&backgroundColor=e83e8c',
        location:     'Adelaide, SA',
        type:         'Full Time',
        salary:       '$180,000 – $250,000',
        salary_num:   215000,
        description:  'Exceptional opportunity for a General Practitioner to join a busy, well-established clinic in Adelaide. Visa sponsorship available for the right candidate.',
        requirements: j(['AHPRA Medical Registration', 'FRACGP or equivalent', 'Unrestricted Medicare Provider Number']),
        skills:       j(['General Medicine', 'Patient Management', 'Chronic Disease']),
        visa_types:   j(['482', '186']),
        posted_at:    '2026-06-20T00:00:00.000Z',
        featured:     0,
        active:       1,
      },
      {
        id:           'job-008',
        title:        'Data Scientist',
        company:      'Commonwealth Bank',
        company_logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CB&backgroundColor=ffc107',
        location:     'Sydney, NSW',
        type:         'Full Time',
        salary:       '$130,000 – $160,000',
        salary_num:   145000,
        description:  'Join CommBank\'s Data Science team to build models that improve financial outcomes for millions of Australians.',
        requirements: j(['5+ years data science experience', 'Python / R proficiency', 'ML/AI model deployment']),
        skills:       j(['Python', 'Machine Learning', 'SQL', 'Deep Learning']),
        visa_types:   j(['482', '189']),
        posted_at:    '2026-06-22T00:00:00.000Z',
        featured:     0,
        active:       1,
      },
    ];

    const insertMany = db.transaction(rows => rows.forEach(r =>
      insertJob.run(
        r.id, r.title, r.company, r.company_logo, r.location, r.type,
        r.salary, r.salary_num, r.description, r.requirements, r.skills,
        r.visa_types, r.posted_at, r.featured, r.active
      )));
    insertMany(jobs);
    console.log(`  ✔  Seeded ${jobs.length} job(s)`);
  }

  /* ──────────────────────────────────────────────────────────────────────────
   * APPLICATIONS
   * ──────────────────────────────────────────────────────────────────────── */
  const appCount = db.prepare('SELECT COUNT(*) AS c FROM applications').get().c;
  if (appCount === 0) {
    const insertApp = db.prepare(`
      INSERT INTO applications
        (id, applicant_name, email, phone, occupation, visa_type, status,
         job_id, nationality, age, points, notes, documents, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const applications = [
      {
        id: 'app-001', applicant_name: 'Grace Davies',
        email: 'grace.davies@email.com', phone: '+61 400 111 222',
        occupation: 'Software Engineer', visa_type: 'Skilled 482', status: 'Active',
        job_id: 'job-002', nationality: 'British', age: 29, points: 75,
        notes: 'Strong technical background. Ready for sponsorship.',
        documents: j(['passport.pdf', 'skills_assessment.pdf']),
        created_at: '2026-05-12T09:30:00.000Z',
      },
      {
        id: 'app-002', applicant_name: 'Mikael Ferreira',
        email: 'mikael.ferreira@email.com', phone: '+61 400 222 333',
        occupation: 'Registered Nurse', visa_type: 'Skilled 482', status: 'Documents',
        job_id: 'job-001', nationality: 'Brazilian', age: 33, points: 65,
        notes: 'AHPRA assessment pending. Awaiting English results.',
        documents: j(['passport.pdf']),
        created_at: '2026-05-18T11:00:00.000Z',
      },
      {
        id: 'app-003', applicant_name: 'Chris Topalian',
        email: 'chris.t@email.com', phone: '+61 400 333 444',
        occupation: 'Civil Engineer', visa_type: 'Skilled 186', status: 'Pending Documentation',
        job_id: 'job-003', nationality: 'Armenian', age: 37, points: 70,
        notes: 'Engineers Australia skills assessment in progress.',
        documents: j([]),
        created_at: '2026-05-20T14:45:00.000Z',
      },
      {
        id: 'app-004', applicant_name: 'Sophia Nakamura',
        email: 'sophia.n@email.com', phone: '+61 400 444 555',
        occupation: 'ICU Nurse', visa_type: 'Skilled 482', status: 'Active',
        job_id: 'job-004', nationality: 'Japanese', age: 31, points: 80,
        notes: 'Excellent skills assessment. Fast-track candidate.',
        documents: j(['passport.pdf', 'ahpra.pdf', 'ielts.pdf']),
        created_at: '2026-06-01T08:00:00.000Z',
      },
      {
        id: 'app-005', applicant_name: 'Luca Bianchi',
        email: 'luca.b@email.com', phone: '+61 400 555 666',
        occupation: 'Senior Designer', visa_type: 'Skilled 189', status: 'Active',
        job_id: 'job-005', nationality: 'Italian', age: 28, points: 90,
        notes: 'Points test applicant. Top tier candidate.',
        documents: j(['passport.pdf', 'skills.pdf']),
        created_at: '2026-06-05T10:30:00.000Z',
      },
      {
        id: 'app-006', applicant_name: 'Amara Okonkwo',
        email: 'amara.o@email.com', phone: '+61 400 666 777',
        occupation: 'Structural Engineer', visa_type: 'Skilled 186', status: 'Pending Documentation',
        job_id: 'job-006', nationality: 'Nigerian', age: 35, points: 68,
        notes: 'EA assessment completed. Awaiting employer nomination.',
        documents: j(['passport.pdf', 'ea_cert.pdf']),
        created_at: '2026-06-08T13:15:00.000Z',
      },
      {
        id: 'app-007', applicant_name: 'Ravi Sharma',
        email: 'ravi.s@email.com', phone: '+61 400 777 888',
        occupation: 'Data Scientist', visa_type: 'Skilled 482', status: 'Active',
        job_id: 'job-008', nationality: 'Indian', age: 27, points: 85,
        notes: 'Exceptional candidate. PhD in Machine Learning.',
        documents: j(['passport.pdf', 'transcript.pdf', 'skills.pdf']),
        created_at: '2026-06-10T09:00:00.000Z',
      },
      {
        id: 'app-008', applicant_name: 'Elena Popescu',
        email: 'elena.p@email.com', phone: '+61 400 888 999',
        occupation: 'General Practitioner', visa_type: 'Skilled 482', status: 'Documents',
        job_id: 'job-007', nationality: 'Romanian', age: 41, points: 65,
        notes: 'AMC Part 1 and 2 completed. Awaiting AHPRA registration.',
        documents: j(['passport.pdf', 'amc_cert.pdf']),
        created_at: '2026-06-12T16:00:00.000Z',
      },
    ];

    const insertMany = db.transaction(rows => rows.forEach(r =>
      insertApp.run(
        r.id, r.applicant_name, r.email, r.phone, r.occupation, r.visa_type,
        r.status, r.job_id, r.nationality, r.age, r.points, r.notes,
        r.documents, r.created_at
      )));
    insertMany(applications);
    console.log(`  ✔  Seeded ${applications.length} application(s)`);
  }

  /* ──────────────────────────────────────────────────────────────────────────
   * ACTIVITIES
   * ──────────────────────────────────────────────────────────────────────── */
  const actCount = db.prepare('SELECT COUNT(*) AS c FROM activities').get().c;
  if (actCount === 0) {
    const insertAct = db.prepare(`
      INSERT INTO activities (id, user_name, role, avatar, action, time_ago, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const activities = [
      { id: uuidv4(), user_name: 'Adrian Grobbelaar', role: 'Senior Digital Designer',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian',  action: 'Application submitted',          time_ago: '2 mins ago',  created_at: now() },
      { id: uuidv4(), user_name: 'Aryandi Alva',       role: 'Software Engineer',          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryandi', action: 'Documents uploaded',             time_ago: '15 mins ago', created_at: now() },
      { id: uuidv4(), user_name: 'Caitlan James',      role: 'Registered Nurse',           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caitlan', action: 'Status updated to Active',       time_ago: '1 hour ago',  created_at: now() },
      { id: uuidv4(), user_name: 'Omar Hassan',        role: 'Civil Engineer',             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',    action: 'New application started',        time_ago: '3 hours ago', created_at: now() },
    ];

    const insertMany = db.transaction(rows => rows.forEach(r =>
      insertAct.run(r.id, r.user_name, r.role, r.avatar, r.action, r.time_ago, r.created_at)));
    insertMany(activities);
    console.log(`  ✔  Seeded ${activities.length} activit(ies)`);
  }

  console.log('🌱  Database seeding complete\n');
}

module.exports = { seed };

// Allow direct execution: node src/database/seed.js
if (require.main === module) {
  seed();
  process.exit(0);
}
