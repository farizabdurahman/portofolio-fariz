// server/routes/api.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ---- GET /api/profile ----
router.get('/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json(profile || {});
});

// ---- GET /api/skills ----
router.get('/skills', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});
  res.json({ skills, grouped });
});

// ---- GET /api/projects ----
router.get('/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
  const projects = rows.map(p => ({ ...p, tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [] }));
  res.json(projects);
});

// ---- GET /api/projects/:slug ----
router.get('/projects/:slug', (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE slug = ?').get(req.params.slug);
  if (!p) return res.status(404).json({ error: 'Project tidak ditemukan' });
  res.json({ ...p, tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [] });
});

// ---- GET /api/experience ----
router.get('/experience', (req, res) => {
  const rows = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC').all();
  res.json(rows);
});

// ---- POST /api/contact ----
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !name.trim()) return res.status(400).json({ error: 'Nama wajib diisi.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email tidak valid.' });
  }
  if (!message || !message.trim()) return res.status(400).json({ error: 'Pesan wajib diisi.' });

  const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
  const info = stmt.run(name.trim(), email.trim(), message.trim());

  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

module.exports = router;
