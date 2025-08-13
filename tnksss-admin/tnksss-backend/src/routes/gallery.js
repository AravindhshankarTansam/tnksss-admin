import express from "express";
import { db } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Setup multer
const uploadsDir = path.join("uploads", "gallery");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// GET all gallery entries
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM gallery ORDER BY created_at DESC").all();
  // parse JSON images
  rows.forEach(r => r.images = r.images ? JSON.parse(r.images) : []);
  res.json(rows);
});

// POST new entry with images
router.post("/", upload.array("images"), (req, res) => {
  const { titleEn, titleTa, date, descEn, descTa, publish } = req.body;
  const files = req.files.map(f => `${uploadsDir}/${f.filename}`);
  const stmt = db.prepare("INSERT INTO gallery (titleEn, titleTa, date, images, descEn, descTa, publish) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const info = stmt.run(titleEn, titleTa, date, JSON.stringify(files), descEn, descTa, publish ? 1 : 0);

  const newEntry = db.prepare("SELECT * FROM gallery WHERE id = ?").get(info.lastInsertRowid);
  newEntry.images = files;
  res.json(newEntry);
});

// PATCH toggle publish
router.patch("/:id/toggle", (req, res) => {
  const { id } = req.params;
  const entry = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const newStatus = entry.publish ? 0 : 1;
  db.prepare("UPDATE gallery SET publish = ? WHERE id = ?").run(newStatus, id);

  const updated = db.prepare("SELECT * FROM gallery WHERE id = ?").get(id);
  updated.images = updated.images ? JSON.parse(updated.images) : [];
  res.json(updated);
});

export default router;
