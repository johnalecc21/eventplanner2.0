// routes/messages.js
import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get messages for a specific service and user
router.get('/', auth, async (req, res) => {
  try {
    const { serviceId, userId } = req.query;

    // Obtener mensajes entre el usuario autenticado y el otro usuario
    const messages = await Message.find({
      serviceId,
      $or: [
        { senderId: userId, receiverId: req.user.userId }, // Mensajes recibidos
        { receiverId: req.user.userId, receiverId: userId }, // Mensajes enviados
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});


// Send a new message
// routes/messages.js
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, userId, content } = req.body;

    // Crear un nuevo mensaje
    const message = new Message({
      serviceId,
      senderId: req.user.userId, // ID del usuario autenticado
      receiverId: userId, // ID del destinatario
      content,
      createdAt: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

export default router;