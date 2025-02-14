import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json({ message: 'good health' });
  } catch (error) {
    res.status(500).json({ message: 'Server error get all' });
  }
});



export default router;