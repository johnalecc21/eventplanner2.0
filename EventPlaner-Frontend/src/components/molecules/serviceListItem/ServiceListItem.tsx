import { StarIcon, ArrowRight } from 'lucide-react';

interface ServiceListItemProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  price: number;
}

const ServiceListItem = ({
  id,
  name,
  category,
  rating,
  reviews,
  image,
  price,
}: ServiceListItemProps) => {
  return (
    <div className="flex border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
      {/* Imagen */}
      <div className="w-44 h-36 md:w-52 md:h-40 flex-shrink-0">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Encabezado */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-indigo-100 text-primary rounded-full">
                {category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-semibold text-primary">${price}</span>
              <p className="text-xs text-gray-400">por servicio</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {rating.toFixed(1)} ({reviews} reseñas)
            </span>
          </div>
        </div>

        {/* Botón */}
        <div className="mt-4 text-right">
          <a 
            href={`/services/${id}`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Ver detalles <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceListItem;