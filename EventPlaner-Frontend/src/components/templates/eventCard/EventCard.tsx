import { Calendar, MapPin, Tag } from 'lucide-react';

interface EventCardProps {
  title: string;
  image: string;
  date: string;
  location: string;
  category: string;
}

const EventCard = ({ title, image, date, location, category }: EventCardProps) => {
  return (
    <div className="glass-effect rounded-xl overflow-hidden group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm">
          {category}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-text-secondary">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-text-secondary">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;