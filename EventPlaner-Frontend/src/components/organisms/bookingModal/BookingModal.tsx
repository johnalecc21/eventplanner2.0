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
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Estado para saber si el usuario está logueado
  const navigate = useNavigate();

  useEffect(() => {
    // Comprobar si el token existe en el localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false); // Si no hay token, el usuario no está logueado
      navigate('/login'); // Redirigir al login
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Asegúrate de guardar el userId en localStorage
await axios.post(`https://eventplannerbackend.onrender.com/api/services/${service._id}/book`, { ...formData, userId }, {
  headers: { Authorization: `Bearer ${token}` },
});

      onClose();
    } catch (error) {
      console.error('Error booking service:', error);
    }
  };

  if (!isLoggedIn) {
    return null; // No renderiza el modal si no está logueado
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-effect rounded-xl w-full max-w-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Book {service.name}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Number of Guests
            </label>
            <input
              type="number"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Message to Provider
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary h-32"
              placeholder="Describe your event and requirements..."
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors"
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
