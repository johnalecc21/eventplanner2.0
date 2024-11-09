import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import axios from 'axios';

interface ServiceFormProps {
  service?: any;
  onClose: () => void;
  onSubmit: () => void;
}

const ServiceForm = ({ service, onClose, onSubmit }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || '',
    description: service?.description || '',
    price: service?.price || '',
    location: service?.location || '',
    images: [] as File[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((file: File) => {
            data.append('images', file);
          });
        } else {
          data.append(key, value.toString());
        }
      });

      if (service) {
        await axios.put(`/api/services/${service._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('/api/services', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      onSubmit();
    } catch (error) {
      console.error('Error submitting service:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-effect rounded-xl w-full max-w-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {service ? 'Edit Service' : 'Add New Service'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Service Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              <option value="Photography">Photography</option>
              <option value="Catering">Catering</option>
              <option value="Music & Entertainment">Music & Entertainment</option>
              <option value="Venue">Venue</option>
              <option value="Decoration">Decoration</option>
              <option value="Planning">Planning</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Images
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
                className="hidden"
                id="images"
              />
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm text-text-secondary">
                  Click to upload images (max 5)
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors"
          >
            {service ? 'Update Service' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;