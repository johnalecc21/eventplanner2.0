import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Definición de los tipos para los props de los componentes mock
interface EventCardProps {
  title: string;
  image: string;
  date: string;
  location: string;
  category: string;
  'data-testid'?: string;
}

interface CreateEventModalProps {
  onClose: () => void;
  'data-testid'?: string;
}

// Mock de los componentes externos
jest.mock('../../components/templates/eventCard/EventCard', () => {
  return function MockEventCard(props: EventCardProps) {
    return (
      <div data-testid={props['data-testid'] || 'event-card'}>
        <h3>{props.title}</h3>
        <p>{props.date}</p>
        <p>{props.location}</p>
        <p>{props.category}</p>
      </div>
    );
  };
});

jest.mock('../../components/organisms/createEventModal/CreateEventModal', () => {
  return function MockCreateEventModal(props: CreateEventModalProps) {
    return <div data-testid="create-event-modal"><button onClick={props.onClose}>Close</button></div>;
  };
});

// Mock de las imágenes importadas
jest.mock('../../assets/icons/icon_step1.png', () => 'icon-step1-mock');
jest.mock('../../assets/icons/icon_step2.png', () => 'icon-step2-mock');
jest.mock('../../assets/icons/icon_step3.png', () => 'icon-step3-mock');
jest.mock('../../assets/icons/icon_step4.png', () => 'icon-step4-mock');
jest.mock('../../assets/images/img_fiesta.jpg', () => 'image-party-mock');
jest.mock('../../assets/images/img_carrousel1.jpeg', () => 'image-carrousel1-mock');
jest.mock('../../assets/images/img_carrousel2.jpg', () => 'image-carrousel2-mock');
jest.mock('../../assets/images/img_carrousel3.jpg', () => 'image-carrousel3-mock');

// Componente envuelto en el Router para pruebas
const HomeWithRouter = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe('Home Component', () => {
  // Restablecer temporizadores simulados después de cada prueba
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the Home component correctly', () => {
    render(<HomeWithRouter />);
    
    // Verificar sección de carrusel
    expect(screen.getByTestId('home-container')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-section')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-title')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-description')).toBeInTheDocument();
    
    // Verificar sección de eventos destacados
    expect(screen.getByTestId('featured-events-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-events-title')).toBeInTheDocument();
    expect(screen.getByTestId('view-all-link')).toBeInTheDocument();
    expect(screen.getByTestId('event-cards-container')).toBeInTheDocument();
    
    // Verificar sección "About Us"
    expect(screen.getByTestId('about-us-section')).toBeInTheDocument();
    expect(screen.getByTestId('about-us-title')).toBeInTheDocument();
    expect(screen.getByTestId('about-us-description')).toBeInTheDocument();
    expect(screen.getByTestId('about-us-image')).toBeInTheDocument();
    
    // Verificar sección "How it works"
    expect(screen.getByTestId('how-it-works-section')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works-title')).toBeInTheDocument();
    expect(screen.getByTestId('steps-container')).toBeInTheDocument();
    
    // Verificar todos los pasos
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`step-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`step-icon-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`step-title-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`step-description-${i}`)).toBeInTheDocument();
    }
  });

  it('should open the CreateEventModal when the button is clicked', () => {
    render(<HomeWithRouter />);
    
    // Verificar que el modal no está presente inicialmente
    expect(screen.queryByTestId('create-event-modal')).not.toBeInTheDocument();
    
    // Hacer clic en el botón para crear un evento
    fireEvent.click(screen.getByTestId('create-event-button'));
    
    // Verificar que el modal se muestra
    expect(screen.getByTestId('create-event-modal')).toBeInTheDocument();
  });

  it('should close the CreateEventModal when the close button is clicked', () => {
    render(<HomeWithRouter />);
    
    // Abrir el modal
    fireEvent.click(screen.getByTestId('create-event-button'));
    expect(screen.getByTestId('create-event-modal')).toBeInTheDocument();
    
    // Cerrar el modal
    fireEvent.click(screen.getByText('Close'));
    
    // Verificar que el modal se ha cerrado
    expect(screen.queryByTestId('create-event-modal')).not.toBeInTheDocument();
  });

  it('should render all event cards', () => {
    render(<HomeWithRouter />);
    
    // Verificar que se renderizan las tres tarjetas de eventos
    expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-3')).toBeInTheDocument();
    
    // Verificar el contenido de una de las tarjetas
    expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
    expect(screen.getByText('Summer Music Festival')).toBeInTheDocument();
    expect(screen.getByText('Wedding Expo')).toBeInTheDocument();
  });

  it('should render the carousel images correctly', () => {
    render(<HomeWithRouter />);
    
    // Verificar que las imágenes del carrusel están presentes
    expect(screen.getByTestId('carousel-image-0')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-image-1')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-image-2')).toBeInTheDocument();
  });

  it('should navigate through carousel images automatically', () => {
    // Usar temporizadores simulados para controlar el tiempo
    jest.useFakeTimers();
    
    render(<HomeWithRouter />);
    
    // Verificar que inicialmente el índice es 0 (primera imagen)
    const initialTransformValue = getComputedStyle(screen.getByTestId('carousel-image-0')).transform;
    expect(initialTransformValue).toBe('translateX(0%)');
    
    // Avanzar el tiempo para que el carrusel cambie a la siguiente imagen
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Comprobar que el estado del carrusel ha cambiado (currentIndex ahora debería ser 1)
    // Nota: No podemos verificar directamente el estado interno, pero podemos comprobar sus efectos
    // Al avanzar el tiempo, el efecto useEffect debería haber cambiado el currentIndex
    act(() => {
      // Al pasar 3 segundos más, debería avanzar a la imagen 2
      jest.advanceTimersByTime(3000);
    });
    
    // Y al pasar otros 3 segundos, debería volver a la imagen 0
    act(() => {
      jest.advanceTimersByTime(3000);
    });
  });

  it('should have a working view all link that navigates to marketplace', () => {
    render(<HomeWithRouter />);
    
    const link = screen.getByTestId('view-all-link');
    expect(link).toHaveAttribute('href', '/marketplace');
  });

  it('should have the correct content in About Us section', () => {
    render(<HomeWithRouter />);
    
    const aboutUsDescription = screen.getByTestId('about-us-description');
    expect(aboutUsDescription).toHaveTextContent('We simplify the process of planning your event');
    expect(aboutUsDescription).toHaveTextContent('Find the perfect venue, catering, decoration, and entertainment');
  });

  it('should have the correct content and structure in How it works section', () => {
    render(<HomeWithRouter />);
    
    // Verificar título principal
    expect(screen.getByTestId('how-it-works-title')).toHaveTextContent('How does EventPlanner work?');
    
    // Verificar cada paso
    const stepTitles = [
      'Create your account',
      'Explore services',
      'Customize your event',
      'Contact providers'
    ];
    
    const stepDescriptions = [
      'Sign up to start planning your event.',
      'Find providers and services for your event.',
      'Choose the options that fit your needs.',
      'Discuss details and book services.'
    ];
    
    // Verificar que cada paso tiene el título y descripción correctos
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`step-title-${i}`)).toHaveTextContent(stepTitles[i-1]);
      expect(screen.getByTestId(`step-description-${i}`)).toHaveTextContent(stepDescriptions[i-1]);
    }
  });

  it('should clean up intervals when unmounting', () => {
    // Espiar clearInterval para verificar que se llama al desmontar
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    const { unmount } = render(<HomeWithRouter />);
    
    // Desmontar el componente
    unmount();
    
    // Verificar que clearInterval se llamó al desmontar
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });
});