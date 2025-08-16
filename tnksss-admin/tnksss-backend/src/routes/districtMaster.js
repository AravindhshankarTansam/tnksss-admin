import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all districts
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM districts_master ORDER BY id ASC").all();
  res.json(rows);
});

// POST new district
router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "District name required" });
  }

  // Get last district code
  const last = db.prepare("SELECT code FROM districts_master ORDER BY id DESC LIMIT 1").get();
  let code;
  if (!last) {
    code = "D001";
  } else {
    const num = parseInt(last.code.substring(1)) + 1;
    code = "D" + String(num).padStart(3, "0");
  }

  // Insert district
  const stmt = db.prepare(
    "INSERT INTO districts_master (code, name) VALUES (?, ?)"
  );
  const result = stmt.run(code, name.trim());

  // Return inserted district
  const newDistrict = db.prepare("SELECT * FROM districts_master WHERE id = ?").get(result.lastInsertRowid);
  res.json(newDistrict);
});

// DELETE district
// PATCH update district (name only)
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "District name required" });
  }

  const district = db.prepare("SELECT * FROM districts_master WHERE id = ?").get(id);
  if (!district) {
    return res.status(404).json({ error: "District not found" });
  }

  db.prepare("UPDATE districts_master SET name = ? WHERE id = ?").run(name.trim(), id);
  const updated = db.prepare("SELECT * FROM districts_master WHERE id = ?").get(id);
  res.json(updated);
});

// DELETE district
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const district = db.prepare("SELECT * FROM districts_master WHERE id = ?").get(id);
  if (!district) {
    return res.status(404).json({ error: "District not found" });
  }

  db.prepare("DELETE FROM districts_master WHERE id = ?").run(id);
  res.json({ message: "District deleted successfully" });
});



export default router;
