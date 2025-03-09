import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Variables para los mocks
const mockNavigate = jest.fn();
let mockLocation = { pathname: '/' };

// Mock de los hooks de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe('Navbar Component', () => {
  // Restablecer mocks y localStorage antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockLocation = { pathname: '/' };
  });

  test('renderiza correctamente cuando el usuario no está autenticado', () => {
    render(<Navbar />, { wrapper: BrowserRouter });
    
    // Verificar logo y título
    expect(screen.getByTestId('logo-link')).toBeInTheDocument();
    expect(screen.getByText('EventPlanner')).toBeInTheDocument();
    
    // Verificar enlaces de navegación
    expect(screen.getByTestId('link-marketplace')).toBeInTheDocument();
    expect(screen.getByTestId('link-my-events')).toBeInTheDocument();
    expect(screen.getByTestId('link-community')).toBeInTheDocument();
    
    // Verificar botones de login y registro
    expect(screen.getByTestId('button-login')).toBeInTheDocument();
    expect(screen.getByTestId('button-register')).toBeInTheDocument();
    
    // Verificar que el botón de logout no está presente
    expect(screen.queryByTestId('button-logout')).not.toBeInTheDocument();
  });

  test('renderiza correctamente cuando el usuario está autenticado', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(<Navbar />, { wrapper: BrowserRouter });
    
    // Verificar botón de logout
    expect(screen.getByTestId('button-logout')).toBeInTheDocument();
    
    // Verificar que los botones de login y registro no están presentes
    expect(screen.queryByTestId('button-login')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-register')).not.toBeInTheDocument();
  });

  test('redirige al login cuando un usuario no autenticado hace clic en My Events', () => {
    render(<Navbar />, { wrapper: BrowserRouter });
    
    // Hacer clic en My Events
    fireEvent.click(screen.getByTestId('link-my-events'));
    
    // Verificar que se llama a navigate con '/login'
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('no redirige cuando un usuario autenticado hace clic en My Events', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(<Navbar />, { wrapper: BrowserRouter });
    
    // Hacer clic en My Events
    fireEvent.click(screen.getByTestId('link-my-events'));
    
    // Verificar que no se llama a navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('cierra sesión y redirige al login cuando se hace clic en el botón de logout', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(<Navbar />, { wrapper: BrowserRouter });
    
    // Hacer clic en el botón de logout
    fireEvent.click(screen.getByTestId('button-logout'));
    
    // Verificar que se eliminó el token
    expect(localStorage.getItem('token')).toBeNull();
    
    // Verificar que se redirige a login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('aplica la clase de estilo correcto para el enlace activo', () => {
    // Establecer la ubicación actual como /marketplace antes de renderizar
    mockLocation = { pathname: '/marketplace' };
    
    render(<Navbar />, { wrapper: BrowserRouter });
    
    // Verificar que el enlace de Marketplace tiene la clase de activo
    const marketplaceLink = screen.getByTestId('link-marketplace');
    expect(marketplaceLink).toHaveClass('bg-primary');
    expect(marketplaceLink).toHaveClass('text-white');
    
    // Verificar que otros enlaces no tienen la clase de activo
    const myEventsLink = screen.getByTestId('link-my-events');
    expect(myEventsLink).not.toHaveClass('bg-primary');
    expect(myEventsLink).toHaveClass('text-text');
  });

  test('renderiza el componente NavLink correctamente', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    // Verificar los íconos de los enlaces
    expect(container.querySelector('.lucide-store')).toBeInTheDocument();
    expect(container.querySelector('.lucide-calendar')).toBeInTheDocument();
    expect(container.querySelector('.lucide-users')).toBeInTheDocument();
    expect(container.querySelector('.lucide-party-popper')).toBeInTheDocument();
  });
});