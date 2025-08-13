import express from 'express';
import multer from 'multer';
import path from 'path';
import { addSlider, updateSlider, toggleSliderPublish, getSliders, uploadDir } from '../controllers/sliderController.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Serve uploads folder
router.use('/uploads', express.static(uploadDir));

// Routes
router.post('/', upload.array('images'), addSlider);
router.get('/', getSliders);
router.put('/:id', upload.array('images'), updateSlider);
router.patch('/:id/toggle', toggleSliderPublish);




export default router;
