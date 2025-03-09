import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../../components/templates/serviceCard/ServiceCard';
import CategoryFilter from '../../components/molecules/categoryFilter/CategoryFilter';

interface Service {
  _id: string;
  name: string;
  category: string;
  rating: number;
  reviews: { length: number }[]; 
  images: string[];
  imageUrls: string[];
  price: number;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://eventplannerbackend.onrender.com/api/services');
        const data = await response.json();
        setServices(data);
        setFilteredServices(data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All Services') {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  return (
    <div className="space-y-8 p-4" data-testid="marketplace-container">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-72" data-testid="category-filter-container">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <div className="flex-1 space-y-6">

          <div
            className="glass-effect p-4 rounded-2xl flex items-center gap-4 shadow-lg"
            data-testid="search-filter-container"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                data-testid="search-input"
              />
            </div>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              data-testid="filter-button"
            >
              <Filter className="h-5 w-5 text-text-secondary" />
            </button>
          </div>


          {loading ? (
            <p
              className="text-center text-text-secondary"
              data-testid="loading-message"
            >
              Loading services...
            </p>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="services-grid"
            >
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    id={service._id}
                    name={service.name}
                    category={service.category}
                    rating={service.rating || 0}
                    reviews={service.reviews.length}
                    image={service.imageUrls[0]}
                    price={service.price}
                    data-testid={`service-card-${service._id}`} 
                  />
                ))
              ) : (
                <p
                  className="text-center text-text-secondary col-span-full"
                  data-testid="no-services-message"
                >
                  No services found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;