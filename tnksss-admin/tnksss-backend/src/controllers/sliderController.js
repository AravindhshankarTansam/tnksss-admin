import path from "path";
import fs from "fs";
import { db } from "../db.js";

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Add a new slider entry
export const addSlider = (req, res) => {
  const { titleEn, titleTa, date, descEn, descTa, publish } = req.body;

  if (!titleEn || !date) {
    return res
      .status(400)
      .json({ error: "Title (English) and Date are required" });
  }

  const imageUrls = req.files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );

  const stmt = db.prepare(`
    INSERT INTO slider_entries (titleEn, titleTa, date, images, descEn, descTa, publish)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    titleEn,
    titleTa || "",
    date,
    JSON.stringify(imageUrls),
    descEn || "",
    descTa || "",
    publish ? 1 : 0
  );

  res.status(201).json({ id: result.lastInsertRowid, images: imageUrls });
};

// ✅ Update slider entry
export const updateSlider = (req, res) => {
  const { id } = req.params;
  const { titleEn, titleTa, date, descEn, descTa, publish, oldImages } = req.body;

  // Merge old images and new images
  let imageUrls = [];
  // Parse existing image URLs sent from the client
  if (oldImages) {
    try {
      imageUrls = JSON.parse(oldImages);
    } catch {
      imageUrls = [];
    }
  }

  // Add new uploaded images
  if (req.files && req.files.length > 0) {
    const newUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );
    imageUrls = [...imageUrls, ...newUrls];
  }

  // Prepare and execute the update statement
  const stmt = db.prepare(`
    UPDATE slider_entries
    SET titleEn = ?, titleTa = ?, date = ?, images = ?, descEn = ?, descTa = ?, publish = ?
    WHERE id = ?
  `);

  stmt.run(
    titleEn,
    titleTa || "",
    date,
    JSON.stringify(imageUrls),
    descEn || "",
    descTa || "",
    publish ? 1 : 0,
    id
  );

  // Respond with updated info
  res.json({ 
    message: "Entry updated successfully", 
    images: imageUrls,
    id,
    titleEn,
    titleTa,
    date,
    descEn,
    descTa,
    publish: !!(publish ? 1 : 0)
  });
};


// ✅ Toggle publish ON/OFF
export const toggleSliderPublish = (req, res) => {
  console.log("Toggle request received for ID:", req.params.id);
  const { id } = req.params;

  const row = db
    .prepare("SELECT publish FROM slider_entries WHERE id = ?")
    .get(id);
  if (!row) return res.status(404).json({ error: "Entry not found" });

  const newStatus = row.publish ? 0 : 1;
  db.prepare("UPDATE slider_entries SET publish = ? WHERE id = ?").run(
    newStatus,
    id
  );

  console.log("Updated publish status to:", newStatus);
  res.json({ id, publish: !!newStatus });
};

// ✅ Get all slider entries
export const getSliders = (req, res) => {
  // If the query includes `all=true`, return all entries; otherwise filter by publish = 1
  const showAll = req.query.all === 'true';
  const query = showAll ? "SELECT * FROM slider_entries" : "SELECT * FROM slider_entries WHERE publish = 1";
  const rows = db.prepare(query).all();
  rows.forEach((row) => {
    row.images = JSON.parse(row.images || "[]");
    row.publish = !!row.publish;
  });
  res.json(rows);
};



// ✅ Delete slider entry
export const deleteSlider = (req, res) => {
  const { id } = req.params;

  const row = db.prepare("SELECT * FROM slider_entries WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Entry not found" });

  db.prepare("DELETE FROM slider_entries WHERE id = ?").run(id);

  res.json({ message: "Entry deleted successfully" });
};

 export const addNotification = (req, res) => {
  const { textEn, textTa, publish } = req.body;
  if (!textEn && !textTa) return res.status(400).json({ error: "Text required" });
  const stmt = db.prepare(
    `INSERT INTO notification_entries (textEn, textTa, publish) VALUES (?, ?, ?)`
  );
  const result = stmt.run(textEn || "", textTa || "", publish ? 1 : 0);
  res.status(201).json({ id: result.lastInsertRowid, textEn, textTa, publish: !!publish });
};

// Update Notification
export const updateNotification = (req, res) => {
  const { id } = req.params;
  const { textEn, textTa, publish } = req.body;
  db.prepare(
    `UPDATE notification_entries SET textEn = ?, textTa = ?, publish = ? WHERE id = ?`
  ).run(textEn || "", textTa || "", publish ? 1 : 0, id);
  res.json({ id, textEn, textTa, publish: !!publish });
};

// Toggle Publish
export const toggleNotificationPublish = (req, res) => {
  const { id } = req.params;
  const row = db.prepare(`SELECT publish FROM notification_entries WHERE id = ?`).get(id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const newStatus = row.publish ? 0 : 1;
  db.prepare(`UPDATE notification_entries SET publish = ? WHERE id = ?`).run(newStatus, id);
  res.json({ id, publish: !!newStatus });
};

// Get All Notifications
export const getNotifications = (req, res) => {
  const showAll = req.query.all === "true";
  const query = showAll
    ? "SELECT * FROM notification_entries"
    : "SELECT * FROM notification_entries WHERE publish = 1";
  const rows = db.prepare(query).all();
  rows.forEach(row => { row.publish = !!row.publish; });
  res.json(rows);
};

// Delete Notification
export const deleteNotification = (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM notification_entries WHERE id = ?").run(id);
  res.json({ message: "Deleted successfully" });
};


export { uploadDir };
