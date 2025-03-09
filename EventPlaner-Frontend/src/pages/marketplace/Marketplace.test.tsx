import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Marketplace from './Marketplace';

// Definir tipos para los mocks
interface ServiceCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  price: number;
  'data-testid'?: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

// Mockear los módulos que se importan
jest.mock('../../components/templates/serviceCard/ServiceCard', () => {
  return function MockServiceCard(props: ServiceCardProps) {
    return (
      <div data-testid={`service-card-${props.id}`}>
        <div data-testid="service-name">{props.name}</div>
        <div data-testid="service-category">{props.category}</div>
        <div data-testid="service-price">{props.price}</div>
      </div>
    );
  };
});

jest.mock('../../components/molecules/categoryFilter/CategoryFilter', () => {
  return function MockCategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
    return (
      <div data-testid="category-filter">
        <select 
          data-testid="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All Services">All Services</option>
          <option value="Catering">Catering</option>
          <option value="Venue">Venue</option>
          <option value="Photography">Photography</option>
        </select>
      </div>
    );
  };
});

const globalAny: any = globalThis;
globalAny.fetch = jest.fn();

describe('Marketplace Component', () => {
  const mockServices = [
    {
      _id: '1',
      name: 'Service 1',
      category: 'Catering',
      rating: 4.5,
      reviews: [{ id: 'r1' }, { id: 'r2' }],
      images: ['img1.jpg'],
      imageUrls: ['https://example.com/img1.jpg'],
      price: 100
    },
    {
      _id: '2',
      name: 'Service 2',
      category: 'Venue',
      rating: 4.0,
      reviews: [{ id: 'r3' }],
      images: ['img2.jpg'],
      imageUrls: ['https://example.com/img2.jpg'],
      price: 200
    },
    {
      _id: '3',
      name: 'Premium Service',
      category: 'Photography',
      rating: 5.0,
      reviews: [],
      images: ['img3.jpg'],
      imageUrls: ['https://example.com/img3.jpg'],
      price: 300
    }
  ];

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Configurar el mock de fetch para devolver los servicios de prueba
    globalAny.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockServices)
    });
  });

  test('renderiza el componente correctamente con estado de carga', async () => {
    render(<Marketplace />);
    
    // Verificar que el mensaje de carga se muestra inicialmente
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Loading services...');
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
  });

  test('carga y muestra servicios correctamente', async () => {
    render(<Marketplace />);
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Verificar que se muestran todos los servicios
    expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-3')).toBeInTheDocument();
  });

  test('filtra servicios por búsqueda correctamente', async () => {
    render(<Marketplace />);
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Buscar por un término específico
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Premium' } });
    
    // Verificar que solo se muestra el servicio que coincide con la búsqueda
    expect(screen.queryByTestId('service-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-card-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('service-card-3')).toBeInTheDocument();
  });

  test('filtra servicios por categoría correctamente', async () => {
    render(<Marketplace />);
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Seleccionar una categoría específica
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Venue' } });
    
    // Verificar que solo se muestra el servicio de la categoría seleccionada
    expect(screen.queryByTestId('service-card-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('service-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('service-card-3')).not.toBeInTheDocument();
  });

  test('combina filtros de búsqueda y categoría correctamente', async () => {
    render(<Marketplace />);
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Seleccionar una categoría específica
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Catering' } });
    
    // Buscar por un término específico
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Service 1' } });
    
    // Verificar que solo se muestra el servicio que coincide con ambos filtros
    expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('service-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-card-3')).not.toBeInTheDocument();
  });

  test('muestra mensaje cuando no se encuentran servicios', async () => {
    render(<Marketplace />);
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Buscar por un término que no coincide con ningún servicio
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'NonExistentService' } });
    
    // Verificar que se muestra el mensaje de "No services found"
    expect(screen.getByTestId('no-services-message')).toHaveTextContent('No services found.');
  });

  test('maneja errores en la carga de servicios', async () => {
    // Configurar el mock de fetch para simular un error
    globalAny.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    // Espiar console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Marketplace />);
    
    // Esperar a que el componente maneje el error
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Verificar que se registró el error
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching services:', expect.any(Error));
    
    // Verificar que se muestra el mensaje de "No services found" ya que no hay servicios
    expect(screen.getByTestId('no-services-message')).toHaveTextContent('No services found.');
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  test('el botón de filtro está presente y es interactivo', async () => {
    render(<Marketplace />);
    
    const filterButton = screen.getByTestId('filter-button');
    expect(filterButton).toBeInTheDocument();
    
    // Verificar que el botón es interactivo (aunque no tenga funcionalidad en este componente)
    fireEvent.click(filterButton);
  });

  test('resetea los filtros cuando se selecciona "All Services"', async () => {
    render(<Marketplace />);
    
    // Esperar a que los servicios se carguen
    await waitFor(() => {
      expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument();
    });
    
    // Primero filtrar por una categoría
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Venue' } });
    
    // Verificar que solo se muestra el servicio de esa categoría
    expect(screen.queryByTestId('service-card-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('service-card-2')).toBeInTheDocument();
    
    // Ahora seleccionar "All Services"
    fireEvent.change(categorySelect, { target: { value: 'All Services' } });
    
    // Verificar que se muestran todos los servicios nuevamente
    expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-3')).toBeInTheDocument();
  });
});