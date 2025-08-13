import path from 'path';
import fs from 'fs';
import { db } from './../db.js';  // ✅ matches named export


// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Add a new slider entry
export const addSlider = (req, res) => {
  const { titleEn, titleTa, date, descEn, descTa, publish } = req.body;

  if (!titleEn || !date) {
    return res.status(400).json({ error: 'Title (English) and Date are required' });
  }

  const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  const stmt = db.prepare(`
    INSERT INTO slider_entries (titleEn, titleTa, date, images, descEn, descTa, publish)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    titleEn,
    titleTa || '',
    date,
    JSON.stringify(imageUrls),
    descEn || '',
    descTa || '',
    publish ? 1 : 0
  );

  res.status(201).json({ id: result.lastInsertRowid, images: imageUrls });
};

// ✅ Update slider entry
export const updateSlider = (req, res) => {
  const { id } = req.params;
  const { titleEn, titleTa, date, descEn, descTa, publish, oldImages } = req.body;

  let imageUrls = [];
  if (oldImages) {
    try {
      imageUrls = JSON.parse(oldImages);
    } catch {
      imageUrls = [];
    }
  }
  if (req.files.length > 0) {
    const newUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    imageUrls = [...imageUrls, ...newUrls];
  }

  const stmt = db.prepare(`
    UPDATE slider_entries
    SET titleEn = ?, titleTa = ?, date = ?, images = ?, descEn = ?, descTa = ?, publish = ?
    WHERE id = ?
  `);

  stmt.run(
    titleEn,
    titleTa || '',
    date,
    JSON.stringify(imageUrls),
    descEn || '',
    descTa || '',
    publish ? 1 : 0,
    id
  );

  res.json({ message: 'Entry updated successfully', images: imageUrls });
};

// ✅ Toggle publish ON/OFF
export const toggleSliderPublish = (req, res) => {
  const { id } = req.params;

  const row = db.prepare('SELECT publish FROM slider_entries WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Entry not found' });

  const newStatus = row.publish ? 0 : 1;
  db.prepare('UPDATE slider_entries SET publish = ? WHERE id = ?').run(newStatus, id);

  res.json({ id, publish: !!newStatus });
};

// ✅ Get all slider entries
export const getSliders = (req, res) => {
  const rows = db.prepare('SELECT * FROM slider_entries').all();
  rows.forEach(row => {
    row.images = JSON.parse(row.images || '[]');
    row.publish = !!row.publish;
  });
  res.json(rows);
};

export { uploadDir };


