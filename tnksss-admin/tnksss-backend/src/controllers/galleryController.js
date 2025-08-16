import { db } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join("uploads", "gallery");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
export const upload = multer({ storage });

// Helper to convert file path to full URL
const toURL = (req, filePath) => {
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ---------- CONTROLLERS ----------

// Public - get only published
export const getPublishedGallery = (req, res) => {
  const rows = db
    .prepare("SELECT * FROM gallery WHERE publish = 1 ORDER BY created_at DESC")
    .all();

  rows.forEach((r) => {
    r.images = r.images ? JSON.parse(r.images).map((img) => `${req.protocol}://${req.get("host")}/${img.replace(/\\/g, "/")}`) : [];
  });

  res.json(rows);
};

// Admin - get all
export const getAllGallery = (req, res) => {
  const rows = db.prepare("SELECT * FROM gallery ORDER BY created_at DESC").all();
  rows.forEach((r) => {
    r.images = r.images ? JSON.parse(r.images).map((img) => `${req.protocol}://${req.get("host")}/${img.replace(/\\/g, "/")}`) : [];
  });
  res.json(rows);
};

// Admin - add new
export const addGallery = (req, res) => {
  const { titleEn, titleTa, date, descEn, descTa, publish } = req.body;
  const files = req.files.map((f) => `${uploadsDir}/${f.filename}`);

  const stmt = db.prepare(
    "INSERT INTO gallery (titleEn, titleTa, date, images, descEn, descTa, publish) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const info = stmt.run(titleEn, titleTa, date, JSON.stringify(files), descEn, descTa, publish ? 1 : 0);

  const newEntry = db.prepare("SELECT * FROM gallery WHERE id = ?").get(info.lastInsertRowid);
  newEntry.images = newEntry.images ? JSON.parse(newEntry.images).map((img) => `${req.protocol}://${req.get("host")}/${img.replace(/\\/g, "/")}`) : [];
  res.json(newEntry);
};

// Admin - toggle publish
export const toggleGalleryPublish = (req, res) => {
  const { id } = req.params;
  const entry = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const newStatus = entry.publish ? 0 : 1;
  db.prepare("UPDATE gallery SET publish = ? WHERE id = ?").run(newStatus, id);

  const updated = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
  updated.images = updated.images ? JSON.parse(updated.images).map((img) => `${req.protocol}://${req.get("host")}/${img.replace(/\\/g, "/")}`) : [];
  res.json(updated);
};

// Admin - delete
export const deleteGallery = (req, res) => {
  const { id } = req.params;
  const entry = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  // delete from DB
  db.prepare("DELETE FROM gallery WHERE id = ?").run(id);

  // delete files
  if (entry.images) {
    const images = JSON.parse(entry.images);
    images.forEach((img) => {
      const filePath = path.resolve(img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  }

  res.json({ message: "Gallery entry deleted successfully" });
};
