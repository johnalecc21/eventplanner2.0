import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import axios from 'axios';
import BookingModal from '../../components/organisms/bookingModal/BookingModal';

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  images: string[];
  imageUrls: string[];
  rating: number;
  reviews: Review[];
  price: number;
  location: string;
}

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(`https://eventplannerbackend.onrender.com/api/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
  };

  if (!service) return null;

  return (
    <div className="space-y-8">
<div className="relative h-100 rounded-2xl overflow-hidden">
  <div className={`w-full h-full ${service.imageUrls.length > 1 ? 'grid grid-cols-2 gap-2' : 'grid-cols-1'}`}>
    {service.imageUrls.length > 1 ? (
      // Si hay más de una imagen, mostramos un collage
      <>
        <img
          src={service.imageUrls[0]}
          alt={service.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="w-full h-full grid grid-cols-1 gap-2">
          {service.imageUrls.slice(1).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Service Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          ))}
        </div>
      </>
    ) : (
      // Si solo hay una imagen, mostramos la imagen única
      <img
        src={service.imageUrls[0]}
        alt={service.name}
        className="w-full h-full object-cover"
      />
    )}
  </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-md">{service.name}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="flex items-center space-x-1">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-xl text-white font-semibold">{service.rating}</span>
            </span>
            <span className="text-lg text-white/80">({service.reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detalles principales */}
        <div className="lg:col-span-2 space-y-8">
          {/* Acerca del servicio */}
          <div className="glass-effect rounded-2xl p-6 shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">About this service</h2>
            <p className="text-text-secondary">{service.description}</p>
          </div>

          {/* Reseñas */}
          <div className="glass-effect rounded-2xl p-6 shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-primary">Reviews</h2>
            <div className="space-y-6">
              {service.reviews.length > 0 ? (
                service.reviews.map((review) => (
                  <div key={review._id} className="border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <img
                        src={review.user.avatar || `https://ui-avatars.com/api/?name=${review.user.name}`}
                        alt={review.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-lg">{review.user.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-text-secondary">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar con detalles del servicio */}
        <div className="glass-effect rounded-2xl p-6 h-fit sticky top-24 shadow-md">
          <div className="space-y-6">
            <div className="text-4xl font-bold text-primary">
              ${service.price}
              <span className="text-lg text-text-secondary font-normal">/event</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-text-secondary">
                <MapPin className="h-6 w-6" />
                <span>{service.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary">
                <Calendar className="h-6 w-6" />
                <span>Check availability</span>
              </div>
            </div>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal de reserva */}
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