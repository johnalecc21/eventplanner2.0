import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  price: number;
}

const ServiceCard = ({ id, name, category, rating, reviews, image, price }: ServiceCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/services/${id}`)}
      className="glass-effect rounded-xl overflow-hidden group cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      style={{
        background: 'var(--background)',
        color: 'var(--text)',
      }}
      data-testid="service-card" 
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          data-testid="service-image" 
        />
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm text-white"
          data-testid="service-category" 
        >
          {category}
        </div>
      </div>

      <div
        className="p-6 space-y-4"
        style={{
          background: 'var(--background)',
        }}
      >
        <h3
          className="text-xl font-semibold"
          style={{
            color: 'var(--text)',
          }}
          data-testid="service-name" 
        >
          {name}
        </h3>

        <div className="flex items-center space-x-2" data-testid="service-rating"> 
          <Star
            className="h-5 w-5"
            style={{
              color: 'var(--accent)',
              fill: 'var(--accent)',
            }}
            data-testid="service-star-icon" 
          />
          <span
            className="font-medium"
            style={{
              color: 'var(--text)',
            }}
            data-testid="service-rating-value" 
          >
            {rating}
          </span>
          <span
            className="text-text-secondary"
            style={{
              color: 'var(--text-secondary)',
            }}
            data-testid="service-reviews" 
          >
            ({reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-2xl font-bold"
            style={{
              color: 'var(--text)',
            }}
            data-testid="service-price" 
          >
            ${price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${id}`);
            }}
            className="px-4 py-2 rounded-full transition-colors"
            style={{
              background: 'var(--primary)',
              color: '#fff',
            }}
            data-testid="service-book-button" 
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;