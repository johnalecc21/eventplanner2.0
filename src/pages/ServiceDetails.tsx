import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import axios from 'axios';
import BookingModal from '../components/BookingModal';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(`/api/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
  };

  if (!service) return null;

  return (
    <div className="space-y-8">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <img
          src={service.images[0]}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>{service.rating}</span>
            </span>
            <span className="text-text-secondary">({service.reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">About this service</h2>
            <p className="text-text-secondary">{service.description}</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {service.reviews.map((review) => (
                <div key={review._id} className="border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={review.user.avatar || `https://ui-avatars.com/api/?name=${review.user.name}`}
                      alt={review.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-secondary">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 h-fit sticky top-24">
          <div className="space-y-4">
            <div className="text-3xl font-bold">
              ${service.price}
              <span className="text-lg text-text-secondary font-normal">/event</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-text-secondary">
                <MapPin className="h-5 w-5" />
                <span>{service.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary">
                <Calendar className="h-5 w-5" />
                <span>Check availability</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          service={service}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ServiceDetails;