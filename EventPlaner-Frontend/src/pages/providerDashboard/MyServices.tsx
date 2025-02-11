// pages/providerDashboard/MyServices.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import ServiceForm from '../../components/molecules/serviceForm/ServiceForm';

// Definir la interfaz para los servicios
interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
}

const MyServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      fetchServices(userId);
    }
  }, []);

  const fetchServices = async (providerId: string) => {
    try {
      const response = await axios.get<Service[]>('http://localhost:5001/api/services', {
        params: { providerId },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        console.log('Deleting service with ID:', serviceId, 'and provider ID:', userId);
        await axios.delete(`http://localhost:5001/api/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Service deleted successfully');
        fetchServices(userId);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="glass-effect rounded-xl overflow-hidden">
            <div className="relative h-48">
              <img
                src={service.imageUrls[0] || 'https://via.placeholder.com/300'} // Fallback image
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 space-x-2">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-colors"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-text-secondary mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${service.price}</span>
                <span className="px-3 py-1 rounded-full glass-effect text-sm">
                  {service.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
          onSubmit={() => {
            setIsModalOpen(false);
            setEditingService(null);
            const token = localStorage.getItem('token');
            if (token) {
              const userId = JSON.parse(atob(token.split('.')[1])).userId;
              fetchServices(userId);
            }
          }}
        />
      )}
    </div>
  );
};

export default MyServices;