import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MyServices from './MyServices';

// Mock axios
jest.mock('axios');

// Define tipos para los mocks de axios
interface MockedAxios {
  get: jest.Mock;
  delete: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
}

// Cast axios como un objeto con métodos mockeados
const mockedAxios = axios as unknown as MockedAxios;

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock services data
const mockServices = [
  {
    _id: '1',
    name: 'Service 1',
    description: 'Description for service 1',
    price: 100,
    category: 'Category 1',
    imageUrls: ['https://example.com/image1.jpg'],
  },
  {
    _id: '2',
    name: 'Service 2',
    description: 'Description for service 2',
    price: 200,
    category: 'Category 2',
    imageUrls: [],
  },
];

// Define tipos para los componentes mockeados
interface ServiceFormProps {
  service: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
  } | null;
  onClose: () => void;
  onSubmit: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

// Mock ServiceForm component
jest.mock('../../components/molecules/serviceForm/ServiceForm', () => ({
  __esModule: true,
  default: ({ service, onClose, onSubmit }: ServiceFormProps) => (
    <div data-testid="service-form-mock">
      <span>Service: {service ? service.name : 'New Service'}</span>
      <button data-testid="close-form-button" onClick={onClose}>Close</button>
      <button data-testid="submit-form-button" onClick={onSubmit}>Submit</button>
    </div>
  ),
}));

// Mock Modal component
jest.mock('../../components/atoms/modal/Modal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onConfirm, title, message }: ModalProps) => (
    isOpen ? (
      <div data-testid="modal-mock">
        <h2>{title}</h2>
        <p>{message}</p>
        <button data-testid="confirm-button" onClick={onConfirm}>Confirm</button>
        <button data-testid="cancel-button" onClick={onClose}>Cancel</button>
      </div>
    ) : null
  ),
}));

describe('MyServices Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIn0.signature');
    
    // Configurar mocks de axios
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: mockServices }));
    mockedAxios.delete.mockImplementation(() => Promise.resolve({ data: { message: 'Service deleted successfully' } }));
  });
  
  afterEach(() => {
    localStorage.clear();
  });

  it('renders the component correctly', async () => {
    render(<MyServices />);
    
    // Check header elements
    expect(screen.getByTestId('header-title')).toHaveTextContent('My Services');
    expect(screen.getByTestId('add-service-button')).toBeInTheDocument();
    
    // Wait for services to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/services',
        { params: { providerId: 'user123' } }
      );
    });

    // Check if service cards are rendered
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('service-card-2')).toBeInTheDocument();
    });
  });

  it('renders service details correctly', async () => {
    render(<MyServices />);
    
    await waitFor(() => {
      // Check first service details
      expect(screen.getByTestId('service-name-1')).toHaveTextContent('Service 1');
      expect(screen.getByTestId('service-description-1')).toHaveTextContent('Description for service 1');
      expect(screen.getByTestId('service-price-1')).toHaveTextContent('$100');
      expect(screen.getByTestId('service-category-1')).toHaveTextContent('Category 1');
      
      // Check second service details
      expect(screen.getByTestId('service-name-2')).toHaveTextContent('Service 2');
    });
  });

  it('displays the correct image or fallback for services', async () => {
    render(<MyServices />);
    
    await waitFor(() => {
      // First service should have actual image
      const img1 = screen.getByTestId('service-image-1') as HTMLImageElement;
      expect(img1.src).toBe('https://example.com/image1.jpg');
      
      // Second service should have fallback image
      const img2 = screen.getByTestId('service-image-2') as HTMLImageElement;
      expect(img2.src).toBe('https://via.placeholder.com/300');
    });
  });

  it('opens add service modal when add button is clicked', async () => {
    render(<MyServices />);
    
    // Click add service button
    fireEvent.click(screen.getByTestId('add-service-button'));
    
    // Check if form appears with no existing service
    await waitFor(() => {
      expect(screen.getByTestId('service-form-mock')).toBeInTheDocument();
      expect(screen.getByText('Service: New Service')).toBeInTheDocument();
    });
  });

  it('opens edit service modal with correct service data', async () => {
    render(<MyServices />);
    
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    });
    
    // Click edit button for first service
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Check if form appears with service data
    await waitFor(() => {
      expect(screen.getByTestId('service-form-mock')).toBeInTheDocument();
      expect(screen.getByText('Service: Service 1')).toBeInTheDocument();
    });
  });

  it('closes service form when close button is clicked', async () => {
    render(<MyServices />);
    
    // Open add service modal
    fireEvent.click(screen.getByTestId('add-service-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('service-form-mock')).toBeInTheDocument();
    });
    
    // Close the form
    fireEvent.click(screen.getByTestId('close-form-button'));
    
    // Check if form disappears
    await waitFor(() => {
      expect(screen.queryByTestId('service-form-mock')).not.toBeInTheDocument();
    });
  });

  it('refreshes services after successful form submission', async () => {
    render(<MyServices />);
    
    // Clear previous calls
    mockedAxios.get.mockClear();
    
    // Open add service modal
    fireEvent.click(screen.getByTestId('add-service-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('service-form-mock')).toBeInTheDocument();
    });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('submit-form-button'));
    
    // Check if services are fetched again
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/services',
        { params: { providerId: 'user123' } }
      );
    });
  });

  it('opens delete confirmation modal when delete button is clicked', async () => {
    render(<MyServices />);
    
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    });
    
    // Click delete button for first service
    fireEvent.click(screen.getByTestId('delete-button-1'));
    
    // Check if confirmation modal appears
    await waitFor(() => {
      expect(screen.getByTestId('modal-mock')).toBeInTheDocument();
      expect(screen.getByText('Delete Service')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this service?')).toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel button is clicked', async () => {
    render(<MyServices />);
    
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    });
    
    // Open delete modal
    fireEvent.click(screen.getByTestId('delete-button-1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal-mock')).toBeInTheDocument();
    });
    
    // Click cancel button
    fireEvent.click(screen.getByTestId('cancel-button'));
    
    // Check if modal disappears
    await waitFor(() => {
      expect(screen.queryByTestId('modal-mock')).not.toBeInTheDocument();
    });
  });

  it('deletes service when confirmation is given', async () => {
    render(<MyServices />);
    
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    });
    
    // Open delete modal
    fireEvent.click(screen.getByTestId('delete-button-1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal-mock')).toBeInTheDocument();
    });
    
    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-button'));
    
    // Check if delete API is called
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/services/1',
        { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIn0.signature' } }
      );
    });
    
    // Check if services are fetched again
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/services',
        { params: { providerId: 'user123' } }
      );
    });
  });

  it('handles API errors when fetching services', async () => {
    // Mock console.error to avoid cluttering test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock error response for get
    mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error('API error')));
    
    render(<MyServices />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching services:', expect.any(Error));
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('handles API errors when deleting services', async () => {
    // Mock console.error to avoid cluttering test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    render(<MyServices />);
    
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    });
    
    // Mock error response for delete
    mockedAxios.delete.mockImplementationOnce(() => Promise.reject(new Error('Delete API error')));
    
    // Open delete modal and confirm
    fireEvent.click(screen.getByTestId('delete-button-1'));
    await waitFor(() => {
      expect(screen.getByTestId('modal-mock')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('confirm-button'));
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error deleting service:', expect.any(Error));
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('handles missing token gracefully', async () => {
    // Clear localStorage
    localStorage.clear();
    
    render(<MyServices />);
    
    // Should not try to fetch services without token
    await waitFor(() => {
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  it('handles missing token when trying to delete a service', async () => {
    // First render with token to get services
    render(<MyServices />);
    
    await waitFor(() => {
      expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    });
    
    // Then clear token and try to delete
    localStorage.clear();
    mockedAxios.delete.mockClear();
    
    // Open delete modal and confirm
    fireEvent.click(screen.getByTestId('delete-button-1'));
    await waitFor(() => {
      expect(screen.getByTestId('modal-mock')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('confirm-button'));
    
    // Should not try to delete without token
    await waitFor(() => {
      expect(mockedAxios.delete).not.toHaveBeenCalled();
    });
  });
});