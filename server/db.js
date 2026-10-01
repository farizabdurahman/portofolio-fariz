// server/db.js
// Koneksi database SQLite (file-based) + pembuatan tabel jika belum ada.
// Kenapa SQLite? Ringan, tidak perlu install DB server terpisah,
// tapi tetap "database" sungguhan (bukan sekadar file JSON).

const fs = require('fs');
const os = require('os');

const DB_PATH = os.homedir() + '/.portfolio/portfolio.db';
if (process.env.VERCEL) {
  const tmp = path.join(os.tmpdir(), 'portfolio.db');
  if (!fs.existsSync(tmp)) fs.copyFileSync(DB_PATH, tmp);
  FB_PATH = tmp;
}
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    full_name TEXT NOT NULL,
    nick_name TEXT,
    role TEXT,
    tagline TEXT,
    about TEXT,
    photo_url TEXT,
    resume_url TEXT,
    location TEXT,
    available INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    category TEXT NOT NULL,   -- e.g. Frontend, Backend, Database, Tools
    level TEXT,               -- e.g. Advanced, Intermediate
    icon TEXT,                -- emoji or short code used by the frontend
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    cover_emoji TEXT,          -- placeholder visual (emoji) until real screenshot is added
    cover_gradient TEXT,       -- CSS gradient string for the placeholder cover
    tags TEXT,                 -- comma separated, e.g. "React,Node.js,MongoDB"
    role TEXT,                 -- e.g. "Full-Stack Developer"
    year TEXT,
    status TEXT DEFAULT 'Completed', -- Completed / In Progress / Planned
    live_url TEXT,
    repo_url TEXT,
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT,
    type TEXT,                 -- e.g. "Full-time", "Internship"
    category TEXT,             -- e.g. "Work", "Award", "Training"
    start_date TEXT,
    end_date TEXT,             -- NULL / "Present" if ongoing
    description TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0
  );
`);

module.exports = db;
