import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import CategoryFilter from '../components/CategoryFilter';

// Define la interfaz para los datos del servicio
interface Service {
  _id: string;
  name: string;
  category: string;
  rating: number;
  reviews: { length: number }[]; // asume que `reviews` es un array de objetos
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

  // Llamada a la API para obtener los servicios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/services');
        const data = await response.json();
        setServices(data);
        setFilteredServices(data); // Al principio no hay filtro
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filtrar servicios según la categoría seleccionada
  useEffect(() => {
    let filtered = services;

    // Filtro por búsqueda (si existe una consulta)
    if (searchQuery) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory !== 'All Services') {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
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

          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
