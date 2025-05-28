import { Star, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  price: number;
  description: string;
  location?: string;
  provider?: {
    name: string;
    initials: string;
  };
  color?: 'blue' | 'purple' | 'pink' | 'blue2' | 'green' | 'yellow';
}

const ServiceCard = ({ 
  id, 
  name, 
  category, 
  rating, 
  reviews, 
  image, 
  price,
  description,
  location,
  provider,
  color
}: ServiceCardProps) => {
  const navigate = useNavigate();
  
  // Define color scheme based on card color
  const colorSchemes = {
    blue: {
      background: "bg-[#4f47e5]",
      button: "bg-[#4f47e5] hover:bg-blue-700",
      circle: "bg-[#4f47e5] text-blue-600",
      price: "text-blue-600",
      categoryBg: "bg-blue-100 bg-opacity-80"
    },
    purple: {
      background: "bg-primary",
      button: "bg-primary hover:bg-purple-700",
      circle: "bg-purple-200 text-purple-600",
      price: "text-primary",
      categoryBg: "bg-purple-100 bg-opacity-80"
    },
    pink: {
      background: "bg-[#DB2777]",
      button: "bg-[#DB2777] hover:bg-pink-700",
      circle: "bg-[#DB2777] text-pink-600",
      price: "text-pink-600",
      categoryBg: "bg-pink-100 bg-opacity-80"
    },
    blue2: {
      background: "bg-[#2563EB]",
      button: "bg-[#2563EB] hover:bg-pink-700",
      circle: "bg-pink-200 text-pink-600",
      price: "text-[#2563EB]",
      categoryBg: "bg-pink-100 bg-opacity-80"
    },
    green: {
      background: "bg-[#16A34A]",
      button: "bg-[#16A34A] hover:bg-pink-700",
      circle: "bg-[#16A34A] text-pink-600",
      price: "text-[#16A34A]",
      categoryBg: "bg-pink-100 bg-opacity-80"
    },
    yellow: {
      background: "bg-[#CA8B04]",
      button: "bg-[#CA8B04] hover:bg-pink-700",
      circle: "bg-pink-200 text-pink-600",
      price: "text-[#CA8B04]",
      categoryBg: "bg-pink-100 bg-opacity-80"
    }
  };
  
  // Default to blue if no color is provided
  const scheme = colorSchemes[color || 'blue'];
  
  // Helper function to format price
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)},${price % 1000 === 0 ? '000' : price % 1000}`;
    }
    return `$${price}`;
  };
  
  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return ''; // Si no hay texto, retorna una cadena vacía
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div 
      onClick={() => navigate(`/services/${id}`)}
      className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      data-testid="service-card"
    >
      {/* Card header with image and overlay */}
      <div className={`relative h-48 ${scheme.background}`}>
        {/* Service image */}
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        
        
        {/* Favorite heart button */}
        <button 
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite toggle
          }}
        >
          <Heart className="h-5 w-5 text-gray-400" />
        </button>
        
        {/* Category tag */}
        <div 
          className={`absolute bottom-7 left-4 px-4 py-1 bg-white rounded-full ${scheme.price} font-medium text-sm shadow-md z-10`}
        >
          {category}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5 bg-white rounded-t-3xl -mt-6 relative z-20">
        <div className="space-y-5">
          {/* Title and rating */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 flex-grow">{name}</h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold text-gray-800">{rating}</span>
              <span className="ml-1 text-gray-500">({reviews})</span>
            </div>
          </div>
          
          {/* Provider info - only show if available */}
          {provider && (
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scheme.circle}`}>
                <span className="text-sm font-bold">{provider.initials}</span>
              </div>
              <span className="ml-2 text-gray-600">{provider.name}</span>
            </div>
          )}

          {description && (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{truncateText(description, 90)}</span> {/* Limita a 50 caracteres */}
          </div>
        )}
          
          {/* Location - only show if available */}
          {location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          
          {/* Price and button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm text-gray-500">Desde</span>
              <span className={`ml-1 text-xl font-bold ${scheme.price}`}>{formatPrice(price)}</span>
              {price < 1000 && <span className="text-gray-500 text-sm ml-1">/persona</span>}
              {price >= 1000 && <span className="text-gray-500 text-sm ml-1">/evento</span>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/services/${id}`);
              }}
              className={`px-5 py-2 rounded-full text-white font-medium ${scheme.button} transition-colors duration-300`}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;