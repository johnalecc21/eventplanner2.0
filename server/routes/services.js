import express from 'express';
import multer from 'multer';
import Service from '../models/Service.js';
import { auth } from '../middleware/auth.js';
import { isProvider } from '../middleware/isProvider.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find()
      .populate('provider', 'name')
      .sort('-createdAt');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name')
      .populate('reviews.user', 'name');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (providers only)
router.post('/', auth, isProvider, upload.array('images', 5), async (req, res) => {
  try {
    const { name, category, description, price, location } = req.body;
    const images = req.files.map(file => file.path);

    const service = new Service({
      provider: req.user.userId,
      name,
      category,
      description,
      price,
      location,
      images,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service
router.put('/:id', auth, isProvider, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.userId },
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.reviews.push({
      user: req.user.userId,
      rating,
      comment,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;