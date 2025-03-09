import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../molecules/eventForm/EventForm';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" data-testid="modal-container">
      <div
        className="absolute inset-0"
        onClick={onClose}
        data-testid="overlay"
      />

      <div
        className="relative bg-white rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl animate-fade-in"
        style={{
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        }}
        data-testid="modal-content"
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          data-testid="close-button"
        >
          <X className="h-6 w-6 text-text" />
        </button>

        {!showForm ? (
          <>
            <h2 className="text-3xl font-bold text-center text-primary drop-shadow-sm" data-testid="modal-title">
              Create New Event
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={handleMarketplaceClick}
                className="rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                data-testid="browse-marketplace"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    data-testid="browse-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)]" data-testid="browse-title">Browse Marketplace</h3>
                <p className="text-sm text-text-secondary" data-testid="browse-description">
                  Find and connect with service providers for your event.
                </p>
              </div>

              <div
                onClick={() => setShowForm(true)}
                className="rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                data-testid="create-event"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    data-testid="create-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)]" data-testid="create-title">Create Event</h3>
                <p className="text-sm text-text-secondary" data-testid="create-description">
                  Start planning your event from scratch.
                </p>
              </div>
            </div>
          </>
        ) : (
          <EventForm onClose={onClose} data-testid="event-form" />
        )}
      </div>
    </div>
  );
};

export default CreateEventModal;
