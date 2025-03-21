// routes/bookings.js
import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { auth } from '../middleware/auth.js';
import { isProvider } from '../middleware/isProvider.js';
import { sendConfirmationNotification, sendRejectionNotification } from '../utils/email.js';

const router = express.Router();

// Get bookings for a provider's services
router.get('/provider', auth, isProvider, async (req, res) => {
  try {
    const bookings = await Booking.find({ serviceId: { $in: await Service.find({ provider: req.user.userId }).distinct('_id') } })
      .populate({
        path: 'serviceId',
        populate: { path: 'provider', select: 'name _id' }  // ✅ Asegurar _id
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// Confirm a booking
router.put('/:id/confirm', auth, isProvider, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: 'confirmed' },
        { new: true }
      )
      .populate({
        path: 'serviceId',
        populate: { path: 'provider', select: 'name _id' }  // ✅ Asegurar _id
      })
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Enviar notificación de confirmación al usuario
    const confirmationDetails = {
      serviceName: booking.serviceId.name,
      date: new Date(booking.date).toLocaleDateString(),
      time: booking.time,
      guests: booking.guests,
      message: booking.message,
      providerName: booking.serviceId.provider.name,
    };
    await sendConfirmationNotification(booking.userId.email, confirmationDetails);

    res.json({ message: 'Booking confirmed', booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Server error confirming booking', details: error.message });
  }
});

// Reject a booking
router.put('/:id/reject', auth, isProvider, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { new: true }
      )
      .populate({
        path: 'serviceId',
        populate: { path: 'provider', select: 'name _id' }  // ✅ Asegurar _id
      })
      .populate('userId', 'name email');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Enviar notificación de rechazo al usuario
    const rejectionDetails = {
      serviceName: booking.serviceId.name,
      date: new Date(booking.date).toLocaleDateString(),
      time: booking.time,
      guests: booking.guests,
      message: booking.message,
      providerName: booking.serviceId.provider.name,
    };
    await sendRejectionNotification(booking.userId.email, rejectionDetails);

    res.json({ message: 'Booking rejected', booking });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'Server error rejecting booking', details: error.message });
  }
});

// Get bookings for a user
router.get('/user', auth, async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.user.userId })
        .populate({
          path: 'serviceId',
          populate: { path: 'provider', select: 'name _id' }  // ✅ Asegurar _id
        })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
      
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ message: 'Server error fetching user bookings' });
    }
  });

// Get a specific booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'serviceId',
        populate: { path: 'provider', select: 'name _id' }  // ✅ Asegurar _id
      })
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ message: 'Server error fetching booking by ID' });
  }
});

export default router;
