import express from "express";
import {
  getPublishedGallery,
  getAllGallery,
  addGallery,
  toggleGalleryPublish,
  deleteGallery,
  upload,
} from "../controllers/galleryController.js";

const router = express.Router();

/* ----------- PUBLIC ROUTES ----------- */
router.get("/public/gallery", getPublishedGallery);

/* ----------- ADMIN ROUTES ----------- */
router.get("/admin/gallery", getAllGallery);
router.post("/admin/gallery", upload.array("images"), addGallery);
router.patch("/admin/gallery/:id/toggle", toggleGalleryPublish);
router.delete("/admin/gallery/:id", deleteGallery);

export default router;
