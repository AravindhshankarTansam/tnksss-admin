import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all contact entries
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM contact_entries ORDER BY created_at DESC").all();
  res.json(rows);
});

// POST new contact entry
router.post("/", (req, res) => {
  const { email, phone, messageEn, messageTa, publish } = req.body;

  const stmt = db.prepare(
    `INSERT INTO contact_entries (email, phone, messageEn, messageTa, publish)
     VALUES (?, ?, ?, ?, ?)`
  );
  const result = stmt.run(email, phone, messageEn, messageTa, publish ? 1 : 0);

  const newEntry = db.prepare("SELECT * FROM contact_entries WHERE id = ?").get(result.lastInsertRowid);
  res.json(newEntry);
});

// PATCH toggle publish
router.patch("/:id/toggle", (req, res) => {
  const { id } = req.params;
  const entry = db.prepare("SELECT * FROM contact_entries WHERE id = ?").get(id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const newStatus = entry.publish ? 0 : 1;
  db.prepare("UPDATE contact_entries SET publish = ? WHERE id = ?").run(newStatus, id);

  const updated = db.prepare("SELECT * FROM contact_entries WHERE id = ?").get(id);
  res.json(updated);
});

export default router;
