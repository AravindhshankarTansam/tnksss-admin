import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sliderRoutes from "./routes/slider.js";
import aboutusRoutes from "./routes/aboutus.js";
import galleryRoutes from "./routes/gallery.js";
import contactRoutes from "./routes/contact.js";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/slider", sliderRoutes);
app.use("/aboutus", aboutusRoutes);
app.use("/gallery", galleryRoutes);
app.use("/contact", contactRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
