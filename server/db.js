const fs = require('fs');
const os = require('os');
const path = require('path');
const Database = require('better-sqlite3');

let DB_PATH = path.join(__dirname, 'data', 'portfolio.db');

if (process.env.VERCEL) {
  const tmp = path.join(os.tmpdir(), 'portfolio.db');
  if (!fs.existsSync(tmp)) fs.copyFileSync(DB_PATH, tmp);
  DB_PATH = tmp;
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
    category TEXT NOT NULL,
    level TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    cover_emoji TEXT,
    cover_gradient TEXT,
    tags TEXT,
    role TEXT,
    year TEXT,
    status TEXT DEFAULT 'Completed',
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
    type TEXT,
    category TEXT,
    start_date TEXT,
    end_date TEXT,
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
