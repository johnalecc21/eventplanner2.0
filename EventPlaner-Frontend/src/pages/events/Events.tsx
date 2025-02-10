import { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import EventCard from '../../components/templates/eventCard/EventCard';
import CreateEventModal from '../../components/organisms/createEventModal/CreateEventModal';

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Events</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard
          title="Company Annual Meeting"
          image="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
          date="April 20, 2024"
          location="Chicago, IL"
          category="Corporate"
        />
        <EventCard
          title="Startup Networking"
          image="https://images.unsplash.com/photo-1511578314322-379afb476865"
          date="May 15, 2024"
          location="Boston, MA"
          category="Networking"
        />
      </div>

      {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Events;