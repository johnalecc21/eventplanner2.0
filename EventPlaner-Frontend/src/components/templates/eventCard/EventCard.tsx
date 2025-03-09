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
      style={{ background: 'var(--background)', color: 'var(--text)' }}
      data-testid="event-card"
    >
      <div className="relative h-48 overflow-hidden" data-testid="event-image-container">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          data-testid="event-image"
        />
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm font-medium"
          style={{ background: 'var(--primary)', color: '#fff' }}
          data-testid="event-category"
        >
          {category}
        </div>
      </div>
      <div className="p-6 space-y-4" style={{ background: 'var(--background)' }} data-testid="event-content">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }} data-testid="event-title">
          {title}
        </h3>
        <div className="space-y-2" data-testid="event-details">
          <div className="flex items-center space-x-2" data-testid="event-date">
            <Calendar className="h-4 w-4" style={{ color: 'var(--accent)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {date}
            </span>
          </div>
          <div className="flex items-center space-x-2" data-testid="event-location">
            <MapPin className="h-4 w-4" style={{ color: 'var(--accent)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;