import express from "express";
import { db } from "../db.js"; // adjust path

const router = express.Router();

// GET all about_us entries
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM about_us ORDER BY created_at DESC").all();
  res.json(rows);
});

// POST new entry
router.post("/", (req, res) => {
  const { titleEn, titleTa, descEn, descTa, publish } = req.body;
  const stmt = db.prepare("INSERT INTO about_us (titleEn, titleTa, descEn, descTa, publish) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(titleEn, titleTa, descEn, descTa, publish ? 1 : 0);

  const newEntry = db.prepare("SELECT * FROM about_us WHERE id = ?").get(info.lastInsertRowid);
  res.json(newEntry);
});

// PATCH toggle publish
router.patch("/:id/toggle", (req, res) => {
  const { id } = req.params;
  const entry = db.prepare("SELECT * FROM about_us WHERE id = ?").get(id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const newStatus = entry.publish ? 0 : 1;
  db.prepare("UPDATE about_us SET publish = ? WHERE id = ?").run(newStatus, id);

  const updated = db.prepare("SELECT * FROM about_us WHERE id = ?").get(id);
  res.json(updated);
});

export default router;
