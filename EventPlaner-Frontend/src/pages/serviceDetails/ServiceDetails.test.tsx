// ServiceDetails.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ServiceDetails from './ServiceDetails';
import BookingModal from '../../components/organisms/bookingModal/BookingModal';

// Mocks
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));
jest.mock('../../components/organisms/bookingModal/BookingModal', () => {
  return jest.fn().mockImplementation(({onClose }) => (
    <div data-testid="booking-modal">
      <button onClick={onClose} data-testid="close-modal-button">Close</button>
    </div>
  ));
});

describe('ServiceDetails', () => {
  const mockService = {
    _id: '123',
    name: 'Wedding Planning',
    description: 'Professional wedding planning services',
    images: [],
    imageUrls: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    rating: 4.8,
    reviews: [
      {
        _id: 'review1',
        user: {
          name: 'John Doe',
          avatar: 'avatar.jpg'
        },
        rating: 5,
        comment: 'Excellent service!'
      },
      {
        _id: 'review2',
        user: {
          name: 'Jane Smith'
        },
        rating: 4,
        comment: 'Very good experience'
      }
    ],
    price: 1500,
    location: 'New York'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (axios.get as jest.Mock).mockResolvedValue({ data: mockService });
  });

  it('debe renderizar null cuando no hay datos del servicio', () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: null });
    const { container } = render(<ServiceDetails />);
    expect(container.firstChild).toBeNull();
  });

  it('debe llamar a la API con el ID correcto y mostrar los detalles del servicio', async () => {
    render(<ServiceDetails />);
    
    // Verificar que la API se llamó con el ID correcto
    expect(axios.get).toHaveBeenCalledWith('https://eventplannerbackend.onrender.com/api/services/123');
    
    // Esperar a que los datos se carguen y se muestren
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    expect(screen.getByText('$1500')).toBeInTheDocument();
    expect(screen.getByText('Professional wedding planning services')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(2 reviews)')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('debe mostrar todas las imágenes del servicio correctamente', async () => {
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    const images = screen.getAllByRole('img');
    // Hay 3 imágenes del servicio + 2 avatares de las reseñas
    expect(images.length).toBe(5);
    expect(images[0]).toHaveAttribute('src', 'image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'image2.jpg');
    expect(images[2]).toHaveAttribute('src', 'image3.jpg');
  });

  it('debe mostrar correctamente las reseñas', async () => {
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Excellent service!')).toBeInTheDocument();
    expect(screen.getByText('Very good experience')).toBeInTheDocument();
  });

  it('debe mostrar avatar predeterminado cuando el usuario no tiene avatar', async () => {
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    const avatars = screen.getAllByRole('img').filter(img => img.getAttribute('alt') === 'Jane Smith');
    expect(avatars[0]).toHaveAttribute('src', 'https://ui-avatars.com/api/?name=Jane Smith');
  });

  it('debe mostrar mensaje cuando no hay reseñas', async () => {
    const serviceWithNoReviews = { ...mockService, reviews: [] };
    (axios.get as jest.Mock).mockResolvedValue({ data: serviceWithNoReviews });
    
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
  });

  it('debe abrir el modal de reserva al hacer clic en Book Now', async () => {
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Book Now'));
    
    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
    expect(BookingModal).toHaveBeenCalledWith(
      expect.objectContaining({
        service: mockService,
        onClose: expect.any(Function)
      }),
      expect.anything()
    );
  });

  it('debe cerrar el modal de reserva correctamente', async () => {
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Book Now'));
    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('close-modal-button'));
    expect(screen.queryByTestId('booking-modal')).not.toBeInTheDocument();
  });

  it('debe manejar errores de la API correctamente', async () => {
    console.error = jest.fn(); // Evitar que los errores aparezcan en la consola durante el test
    
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching service details:', expect.any(Error));
    });
  });

  it('debe mostrar una sola imagen cuando hay una sola imagen disponible', async () => {
    const serviceWithOneImage = { ...mockService, imageUrls: ['single-image.jpg'] };
    (axios.get as jest.Mock).mockResolvedValue({ data: serviceWithOneImage });
    
    render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    const serviceImages = screen.getAllByRole('img').filter(img => img.getAttribute('alt') === 'Wedding Planning');
    expect(serviceImages.length).toBe(1);
    expect(serviceImages[0]).toHaveAttribute('src', 'single-image.jpg');
  });

  it('debe volver a cargar los datos cuando cambia el ID', async () => {
    const { rerender } = render(<ServiceDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Wedding Planning')).toBeInTheDocument();
    });
    
    expect(axios.get).toHaveBeenCalledTimes(1);
    
    // Cambiar el ID del parámetro
    (useParams as jest.Mock).mockReturnValue({ id: '456' });
    
    // Volver a renderizar el componente
    rerender(<ServiceDetails />);
    
    // Verificar que se llama a la API nuevamente con el nuevo ID
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith('https://eventplannerbackend.onrender.com/api/services/456');
  });
});