import express from 'express';
import db from '../db.js';
const router = express.Router();

// Get all districts
router.get('/districts', (req, res) => {
  const districts = db.prepare('SELECT * FROM districts ORDER BY name').all();
  res.json(districts);
});

// Add new district
router.post('/districts', (req, res) => {
  const { name } = req.body;
  try {
    const info = db.prepare('INSERT INTO districts (name) VALUES (?)').run(name);
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get menu content by menu_name
router.get('/menu/:menuName', (req, res) => {
  const menuName = req.params.menuName;
  const content = db.prepare('SELECT * FROM menu_contents WHERE menu_name = ?').get(menuName);
  res.json(content || {});
});

// Add or update menu content
router.post('/menu', (req, res) => {
  const { menu_name, english_content, tamil_content } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM menu_contents WHERE menu_name = ?').get(menu_name);
    if (existing) {
      db.prepare('UPDATE menu_contents SET english_content = ?, tamil_content = ? WHERE menu_name = ?')
        .run(english_content, tamil_content, menu_name);
    } else {
      db.prepare('INSERT INTO menu_contents (menu_name, english_content, tamil_content) VALUES (?, ?, ?)')
        .run(menu_name, english_content, tamil_content);
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
