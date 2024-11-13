import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventForm from './EventForm';
import { useState } from 'react';

interface CreateEventModalProps {
  onClose: () => void;
}

const CreateEventModal = ({ onClose }: CreateEventModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleMarketplaceClick = () => {
    onClose();
    navigate('/marketplace');
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

        {!showForm ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={handleMarketplaceClick}
                className="glass-effect rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-4">Browse Marketplace</h3>
                <p className="text-text-secondary">
                  Find and connect with service providers for your event
                </p>
              </div>
              
              <div
                onClick={() => setShowForm(true)}
                className="glass-effect rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-4">Create Event</h3>
                <p className="text-text-secondary">
                  Start planning your event from scratch
                </p>
              </div>
            </div>
          </>
        ) : (
          <EventForm onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default CreateEventModal;