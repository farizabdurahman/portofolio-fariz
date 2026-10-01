const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json(profile || {});
});

router.get('/skills', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});
  res.json({ skills, grouped });
});

router.get('/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
  const projects = rows.map(p => ({ ...p, tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [] }));
  res.json(projects);
});

router.get('/projects/:slug', (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE slug = ?').get(req.params.slug);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json({ ...p, tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [] });
});

router.get('/experience', (req, res) => {
  const rows = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC').all();
  res.json(rows);
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required.' });

  const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
  const info = stmt.run(name.trim(), email.trim(), message.trim());

  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

module.exports = router;
