// src/pages/providerDashboard/MyServices.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import ServiceForm from '../../components/molecules/serviceForm/ServiceForm';
import Modal from '../../components/atoms/modal/Modal';

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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; serviceId: string | null }>({ isOpen: false, serviceId: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      fetchServices(userId);
    }
  }, []);

  const fetchServices = async (providerId: string) => {
    try {
      const response = await axios.get<Service[]>('https://eventplannerbackend.onrender.com/api/services', {
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
        await axios.delete(`https://eventplannerbackend.onrender.com/api/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchServices(userId);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const openDeleteModal = (serviceId: string) => {
    setDeleteModal({ isOpen: true, serviceId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, serviceId: null });
  };

  const confirmDelete = () => {
    if (deleteModal.serviceId) {
      handleDelete(deleteModal.serviceId);
      closeDeleteModal();
    }
  };

  return (
    <div className="space-y-8 p-6 min-h-screen" data-testid="myservices-container">
      {/* Encabezado */}
      <div className="flex items-center justify-between" data-testid="header">
        <h1 className="text-3xl font-bold text-primary" data-testid="header-title">My Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          data-testid="add-service-button"
        >
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="services-grid">
        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1" data-testid={`service-card-${service._id}`}>
            <div className="relative h-48" data-testid={`service-image-container-${service._id}`}>
              <img
                src={service.imageUrls[0] || 'https://via.placeholder.com/300'} 
                alt={service.name}
                className="w-full h-full object-cover"
                data-testid={`service-image-${service._id}`}
              />

              <div className="absolute top-4 right-4 space-x-2" data-testid={`service-buttons-${service._id}`}>
                <button
                  onClick={() => {
                    setEditingService(service);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white transition-colors shadow-sm"
                  data-testid={`edit-button-${service._id}`}
                >
                  <Edit className="h-5 w-5 text-text-secondary" />
                </button>
                <button
                  onClick={() => openDeleteModal(service._id)}
                  className="p-2 rounded-lg bg-white/80 hover:bg-white transition-colors shadow-sm"
                  data-testid={`delete-button-${service._id}`}
                >
                  <Trash className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4" data-testid={`service-details-${service._id}`}>
              <h3 className="text-xl font-semibold text-primary" data-testid={`service-name-${service._id}`}>{service.name}</h3>
              <p className="text-text-secondary line-clamp-2" data-testid={`service-description-${service._id}`}>{service.description}</p>
              <div className="flex items-center justify-between" data-testid={`service-info-${service._id}`}>
                <span className="text-2xl font-bold text-primary" data-testid={`service-price-${service._id}`}>${service.price}</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium" data-testid={`service-category-${service._id}`}>
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
          data-testid="service-form-modal"
        />
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        data-testid="delete-modal"
      />
    </div>
  );
};

export default MyServices;