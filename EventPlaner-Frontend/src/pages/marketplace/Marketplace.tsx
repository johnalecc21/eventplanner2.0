import { useState, useEffect } from 'react';
import ServiceCard from '../../components/templates/serviceCard/ServiceCard';
import ServiceListItem from '../../components/molecules/serviceListItem/ServiceListItem';
import AdvancedFilter from '../../components/molecules/advancedFilter/AdvancedFilter';
import ViewControls from '../../components/molecules/viewControls/ViewControls';

interface Service {
  _id: string;
  name: string;
  category: string;
  location?: string;
  rating: number;
  reviews: { length: number }[]; 
  images: string[];
  imageUrls: string[];
  price: number;
  description: string;
  provider?: {
    _id: string;
    name: string;
  };
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todas las ubicaciones');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [ratingFilter, setRatingFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('Todos');
  
  // Helper function to get provider initials from name
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };


  // Alternative: Get color based on card index (for variety)
  const getColorByIndex = (index: number): 'blue' | 'purple' | 'pink' | 'blue2' | 'green' | 'yellow' => {
    const colors: Array<'blue' | 'purple' | 'pink' | 'blue2' | 'green' | 'yellow'> = ['blue', 'purple', 'pink', 'blue2', 'green', 'yellow'];
    return colors[index % colors.length];
  };

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

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    // Filter by location
    if (selectedLocation !== 'Todas las ubicaciones') {
      filtered = filtered.filter(
        (service) => service.location === selectedLocation
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(
        (service) => service.price >= parseInt(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (service) => service.price <= parseInt(maxPrice)
      );
    }

    // Filter by rating
    if (ratingFilter === '4+') {
      filtered = filtered.filter((service) => service.rating >= 4);
    } else if (ratingFilter === '3+') {
      filtered = filtered.filter((service) => service.rating >= 3);
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, selectedLocation, minPrice, maxPrice, ratingFilter, services]);

  // Reset all filters
  const clearFilters = () => {
    setSelectedCategory('Todos');
    setActiveTab('Todos');
    setSelectedLocation('Todas las ubicaciones');
    setMinPrice('');
    setMaxPrice('');
    setRatingFilter('Todos');
    setSearchQuery('');
  };

  // Apply filters - in this implementation, filters are applied automatically via useEffect
  const applyFilters = () => {
    // This is just a placeholder for UX purposes
    // The actual filtering happens in the useEffect above
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Advanced Filter Component */}
      <AdvancedFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />

      {/* View Controls - Display count and grid/list toggle */}
      <ViewControls 
        totalResults={filteredServices.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Services Content */}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Cargando servicios...</p>
      ) : filteredServices.length > 0 ? (
        viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service._id}
                id={service._id}
                name={service.name}
                category={service.category}
                rating={service.rating || 0}
                reviews={service.reviews.length}
                image={service.imageUrls[0]}
                price={service.price}
                description={service.description}
                location={service.location}
                provider={service.provider ? {
                  name: service.provider.name || "",
                  initials: getInitials(service.provider.name)
                } : undefined}
                // Use either category-based color or index-based color for variety
                color={getColorByIndex(index)}
                data-testid={`service-card-${service._id}`}
              />
            ))}
          </div>
        ) : (
          // List View
          <div className="flex flex-col gap-4">
            {filteredServices.map((service) => (
              <ServiceListItem
                key={service._id}
                id={service._id}
                name={service.name}
                category={service.category}
                rating={service.rating || 0}
                reviews={service.reviews.length}
                image={service.imageUrls[0]}
                price={service.price}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-gray-500 py-12">
          No se encontraron servicios que coincidan con los filtros seleccionados.
        </p>
      )}
    </div>
  );
};

export default Marketplace;