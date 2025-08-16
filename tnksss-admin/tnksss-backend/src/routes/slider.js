import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  addSlider,
  updateSlider,
  toggleSliderPublish,
  getSliders,
  deleteSlider,getNotifications,
  uploadDir,addNotification,updateNotification,toggleNotificationPublish,deleteNotification
} from '../controllers/sliderController.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Serve uploads folder
router.use('/uploads', express.static(uploadDir));

/* ---------------- PUBLIC ROUTES ---------------- */
// 👉 Only published sliders (no ?all needed)
router.get('/public', (req, res) => {
  req.query.all = 'false'; // force published only
  getSliders(req, res);
});

/* ---------------- ADMIN ROUTES ---------------- */
// 👉 Get ALL sliders
router.get('/admin', (req, res) => {
  req.query.all = 'true';
  getSliders(req, res);
});

// 👉 Create new slider
router.post('/admin', upload.array('images'), addSlider);

// 👉 Update slider
router.put('/admin/:id', upload.array('images'), updateSlider);

// 👉 Toggle publish
router.patch('/admin/:id/toggle', toggleSliderPublish);

// 👉 Delete slider
router.delete('/admin/:id', deleteSlider);

/* --------------- LIVE NOTIFICATION ROUTES -------------- */

// Admin routes (all notifications, including unpublished)
router.get('/admin/notification', (req, res) => {
  req.query.all = 'true';
  getNotifications(req, res);
});
router.post('/admin/notification', addNotification);
router.put('/admin/notification/:id', updateNotification);
router.patch('/admin/notification/:id/toggle', toggleNotificationPublish);
router.delete('/admin/notification/:id', deleteNotification);

// Public route: only published notifications
router.get('/public/notification', (req, res) => {
  req.query.all = 'false'; // force only published notifications
  getNotifications(req, res);
});



export default router;
