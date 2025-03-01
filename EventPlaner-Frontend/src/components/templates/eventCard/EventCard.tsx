import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  title: string;
  image: string;
  date: string;
  location: string;
  category: string;
}

const EventCard = ({ title, image, date, location, category }: EventCardProps) => {
  return (
    <div
      className="glass-effect rounded-xl overflow-hidden group cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      style={{
        background: 'var(--background)',
        color: 'var(--text)',
      }}
    >
      {/* Imagen del evento */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Etiqueta de categoría */}
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm font-medium"
          style={{
            background: 'var(--primary)',
            color: '#fff',
          }}
        >
          {category}
        </div>
      </div>

      {/* Contenido del evento */}
      <div
        className="p-6 space-y-4"
        style={{
          background: 'var(--background)',
        }}
      >
        {/* Título */}
        <h3
          className="text-xl font-semibold"
          style={{
            color: 'var(--text)',
          }}
        >
          {title}
        </h3>

        {/* Detalles del evento */}
        <div className="space-y-2">
          {/* Fecha */}
          <div className="flex items-center space-x-2">
            <Calendar
              className="h-4 w-4"
              style={{
                color: 'var(--accent)',
              }}
            />
            <span
              className="text-sm"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              {date}
            </span>
          </div>

          {/* Ubicación */}
          <div className="flex items-center space-x-2">
            <MapPin
              className="h-4 w-4"
              style={{
                color: 'var(--accent)',
              }}
            />
            <span
              className="text-sm"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              {location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;