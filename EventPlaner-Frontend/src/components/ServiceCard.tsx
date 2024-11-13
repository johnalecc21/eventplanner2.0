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
      className="glass-effect rounded-xl overflow-hidden group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm">
          {category}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="font-medium">{rating}</span>
          <span className="text-text-secondary">({reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${price}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${id}`);
            }}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;