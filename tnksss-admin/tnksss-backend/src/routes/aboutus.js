import express from "express";
import {
  getPublishedAboutUs,
  getAllAboutUs,
  createAboutUs,
  updateAboutUs,
  togglePublish,
  deleteAboutUs,
} from "../controllers/AboutusController.js";

const router = express.Router();

/* ---------------- PUBLIC ROUTES ---------------- */
router.get("/public/about_us", getPublishedAboutUs);

/* ---------------- ADMIN ROUTES ---------------- */
router.get("/admin/about_us", getAllAboutUs);
router.post("/admin/about_us", createAboutUs);
router.put("/admin/about_us/:id", updateAboutUs);
router.patch("/admin/about_us/:id/toggle", togglePublish);
router.delete("/admin/about_us/:id", deleteAboutUs);

export default router;
