import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  service: any;
  onClose: () => void;
}

const BookingModal = ({ service, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    message: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.post(
        `https://eventplannerbackend.onrender.com/api/services/${service._id}/book`,
        { ...formData, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose();
    } catch (error) {
      console.error('Error booking service:', error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="booking-modal">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} data-testid="modal-overlay" />

      <div className="relative bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl space-y-6" data-testid="modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          data-testid="close-button"
        >
          <X className="h-6 w-6 text-text-secondary" />
        </button>

        <h2 className="text-2xl font-bold text-primary" data-testid="modal-title">Book {service.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="booking-form">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                required
                data-testid="date-input"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                required
                data-testid="time-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Number of Guests</label>
            <input
              type="number"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              required
              data-testid="guests-input"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Message to Provider</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary h-32 resize-none"
              placeholder="Describe your event and requirements..."
              required
              data-testid="message-input"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
              data-testid="confirm-button"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
