import { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-12">
      <section className="relative h-[500px] rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          alt="Event planning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">
            Create Unforgettable Events with Top Service Providers
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-xl">
            Connect with the best event service providers and plan your perfect event with ease.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg w-fit transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <button className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors">
            <span>View all</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            title="Tech Conference 2024"
            image="https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
            date="March 15, 2024"
            location="San Francisco, CA"
            category="Conference"
          />
          <EventCard
            title="Summer Music Festival"
            image="https://images.unsplash.com/photo-1459749411175-04bf5292ceea"
            date="July 20, 2024"
            location="Austin, TX"
            category="Festival"
          />
          <EventCard
            title="Wedding Expo"
            image="https://images.unsplash.com/photo-1519225421980-715cb0215aed"
            date="April 5, 2024"
            location="New York, NY"
            category="Exhibition"
          />
        </div>
      </section>

      {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;