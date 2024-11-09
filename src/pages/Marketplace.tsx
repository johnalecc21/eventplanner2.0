import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import CategoryFilter from '../components/CategoryFilter';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64">
          <CategoryFilter />
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="glass-effect p-4 rounded-lg flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              name="John Smith Photography"
              category="Photography"
              rating={4.8}
              reviews={124}
              image="https://images.unsplash.com/photo-1493863641943-9b68992a8d07"
              price={799}
            />
            <ServiceCard
              name="Elite Catering Co."
              category="Catering"
              rating={4.9}
              reviews={89}
              image="https://images.unsplash.com/photo-1555244162-803834f70033"
              price={1299}
            />
            <ServiceCard
              name="Soundwave DJ Services"
              category="Music & Entertainment"
              rating={4.7}
              reviews={156}
              image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
              price={599}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;