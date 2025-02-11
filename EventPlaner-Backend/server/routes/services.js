import express from 'express';
import multer from 'multer';
import Service from '../models/Service.js';
import { auth } from '../middleware/auth.js';
import { isProvider } from '../middleware/isProvider.js';
import Booking from '../models/Booking.js';
import { sendBookingNotification } from '../utils/email.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all services
// Get all services (optional: filter by providerId)
router.get('/', async (req, res) => {
  try {
    const { providerId } = req.query;
    let query = {};

    if (providerId) {
      query.provider = providerId;
    }

    const services = await Service.find(query)
      .sort('-createdAt')
      .populate('provider', 'name email')
      .populate('reviews.user', 'name');

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error get all' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    .populate('provider', 'name email')
      .populate('reviews.user', 'name');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error get one' });
  }
});

// Create service (providers only)
router.post('/',  auth, isProvider, upload.array('images', 5), async (req, res) => {
  try {
    const { name, category, description, price, location, imageUrls } = req.body;
    const images = req.files.map(file => file.path);

    const service = new Service({
      name,
      category,
      description,
      price,
      location,
      images,
      imageUrls,
      provider: req.user.userId, 
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error create' });
  }
});

// Update service
router.put('/:id', auth, isProvider, upload.array('images', 5), async (req, res) => {
  try {
    const { name, category, description, price, location, imageUrls } = req.body;
    const images = req.files.map(file => file.path);

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.userId },
      {
        name,
        category,
        description,
        price,
        location,
        images,
        imageUrls,
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    console.log('Service updated successfully:', service);
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service', details: error.message });
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
// Delete service
router.delete('/:id', auth, isProvider, async (req, res) => {
  try {
    console.log('Deleting service with ID:', req.params.id, 'and provider ID:', req.user.userId);
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      provider: req.user.userId,
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    console.log('Service deleted successfully:', service);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', details: error.message });
  }
});

router.post('/:serviceId/book', auth, async (req, res) => {
  console.log("Usuario autenticado:", req.user); 

  const { date, time, guests, message } = req.body;
  const userId = req.user.userId;
  const userName = req.user.name; 

  console.log('Nombre del usuario:', userName); 

  try {
    const service = await Service.findById(req.params.serviceId).populate('provider');
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const booking = new Booking({
      serviceId: req.params.serviceId,
      userId,
      date,
      time,
      guests,
      message,
    });

    await booking.save();

    const providerEmail = service.provider.email;
    const bookingDetails = {
      serviceName: service.name,
      date,
      time,
      guests,
      message,
      userName: userName, 
    };

    await sendBookingNotification(providerEmail, bookingDetails);

    res.status(201).json({ message: 'Booking successful, email sent to provider.' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Error creating booking', details: error.message });
  }
});



export default router;