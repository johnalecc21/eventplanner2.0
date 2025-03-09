
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter
import ServiceCard from './ServiceCard';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ServiceCard', () => {
  const mockService = {
    id: '1',
    name: 'Test Service',
    category: 'Photography',
    rating: 4.5,
    reviews: 10,
    image: 'https://example.com/image.jpg',
    price: 100,
  };

  beforeEach(() => {
    // Limpia el mock antes de cada prueba
    mockNavigate.mockClear();
  });

  test('renders service card with correct data', () => {
    render(
      <MemoryRouter>
        <ServiceCard {...mockService} />
      </MemoryRouter>
    );

    // Verifica que los elementos se rendericen correctamente
    expect(screen.getByTestId('service-card')).toBeInTheDocument();
    expect(screen.getByTestId('service-image')).toHaveAttribute('src', mockService.image);
    expect(screen.getByTestId('service-category')).toHaveTextContent(mockService.category);
    expect(screen.getByTestId('service-name')).toHaveTextContent(mockService.name);
    expect(screen.getByTestId('service-rating-value')).toHaveTextContent(mockService.rating.toString());
    expect(screen.getByTestId('service-reviews')).toHaveTextContent(`(${mockService.reviews} reviews)`);
    expect(screen.getByTestId('service-price')).toHaveTextContent(`$${mockService.price}`);
    expect(screen.getByTestId('service-book-button')).toHaveTextContent('Book Now');
  });

  test('navigates to service details when clicked', () => {
    render(
      <MemoryRouter>
        <ServiceCard {...mockService} />
      </MemoryRouter>
    );

    // Simula un clic en la tarjeta
    fireEvent.click(screen.getByTestId('service-card'));
    expect(mockNavigate).toHaveBeenCalledWith(`/services/${mockService.id}`);
  });

  test('navigates to service details when "Book Now" is clicked', () => {
    render(
      <MemoryRouter>
        <ServiceCard {...mockService} />
      </MemoryRouter>
    );

    // Simula un clic en el botón "Book Now"
    fireEvent.click(screen.getByTestId('service-book-button'));
    expect(mockNavigate).toHaveBeenCalledWith(`/services/${mockService.id}`);
  });
});