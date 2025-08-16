import { db } from "../db.js";

/* ---------------- CONTROLLER FUNCTIONS ---------------- */

// 👉 Get only published entries (for public site)
export const getPublishedAboutUs = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM about_us WHERE publish = 1 ORDER BY created_at DESC").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Get ALL entries (for admin)
export const getAllAboutUs = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM about_us ORDER BY created_at DESC").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Create new entry
export const createAboutUs = (req, res) => {
  try {
    const { titleEn, titleTa, descEn, descTa, publish } = req.body;
    const stmt = db.prepare(
      "INSERT INTO about_us (titleEn, titleTa, descEn, descTa, publish) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(titleEn, titleTa, descEn, descTa, publish ? 1 : 0);

    const newEntry = db.prepare("SELECT * FROM about_us WHERE id = ?").get(info.lastInsertRowid);
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Update entry
export const updateAboutUs = (req, res) => {
  try {
    const { id } = req.params;
    const { titleEn, titleTa, descEn, descTa } = req.body;
    db.prepare(
      "UPDATE about_us SET titleEn = ?, titleTa = ?, descEn = ?, descTa = ? WHERE id = ?"
    ).run(titleEn, titleTa, descEn, descTa, id);

    const updated = db.prepare("SELECT * FROM about_us WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Toggle publish
export const togglePublish = (req, res) => {
  try {
    const { id } = req.params;
    const entry = db.prepare("SELECT * FROM about_us WHERE id = ?").get(id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const newStatus = entry.publish ? 0 : 1;
    db.prepare("UPDATE about_us SET publish = ? WHERE id = ?").run(newStatus, id);

    const updated = db.prepare("SELECT * FROM about_us WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Delete entry
export const deleteAboutUs = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM about_us WHERE id = ?").run(id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
