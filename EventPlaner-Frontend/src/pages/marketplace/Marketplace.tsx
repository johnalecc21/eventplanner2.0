import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../../components/templates/serviceCard/ServiceCard';
import CategoryFilter from '../../components/molecules/categoryFilter/CategoryFilter';

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
        const response = await fetch('https://eventplannerbackend.onrender.com/api/services');
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
    <div className="space-y-8 p-4">
      {/* Barra lateral y contenido principal */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Barra lateral: Filtros */}
        <div className="w-full md:w-72">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 space-y-6">
          {/* Barra de búsqueda y filtro */}
          <div className="glass-effect p-4 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Filter className="h-5 w-5 text-text-secondary" />
            </button>
          </div>

          {/* Lista de servicios */}
          {loading ? (
            <p className="text-center text-text-secondary">Loading services...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  />
                ))
              ) : (
                <p className="text-center text-text-secondary col-span-full">
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