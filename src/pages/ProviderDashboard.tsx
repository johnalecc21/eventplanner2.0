import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import ServiceForm from '../components/ServiceForm';

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/services/provider', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
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
                src={service.images[0]}
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
            fetchServices();
          }}
        />
      )}
    </div>
  );
};

export default ProviderDashboard;