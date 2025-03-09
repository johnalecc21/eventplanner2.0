import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserBookings from './Events';

// Mockear los módulos que se importan
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../components/atoms/modal/Modal', () => {
  return function MockModal({ isOpen, onClose, title, message, confirmButtonText, 'data-testid': dataTestId }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmButtonText: string;
    'data-testid'?: string;
  }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid={dataTestId || 'modal'}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} data-testid="modal-close-button">
          {confirmButtonText}
        </button>
      </div>
    );
  };
});

jest.mock('../../components/atoms/chatModal/ChatModal', () => {
  return function MockChatModal({ isOpen, onClose, providerName, serviceId, userId, 'data-testid': dataTestId }: {
    isOpen: boolean;
    onClose: () => void;
    providerName: string;
    serviceId: string;
    userId: string;
    'data-testid'?: string;
  }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid={dataTestId || 'chat-modal'}>
        <h2>Chat with {providerName}</h2>
        <p>Service ID: {serviceId}</p>
        <p>User ID: {userId}</p>
        <button onClick={onClose} data-testid="chat-modal-close-button">
          Close
        </button>
      </div>
    );
  };
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('UserBookings Component', () => {
  const mockBookings = [
    {
      _id: '1',
      serviceId: {
        _id: 'service1',
        name: 'Wedding Photography',
        provider: {
          _id: 'provider1',
          name: 'Photo Pro'
        }
      },
      userId: {
        _id: 'user1',
        name: 'Jane Doe',
        email: 'jane@example.com'
      },
      date: '2025-04-15',
      time: '14:00',
      guests: 50,
      message: 'Looking forward to the event',
      status: 'confirmed' as const,
      createdAt: '2025-03-01T12:00:00.000Z'
    },
    {
      _id: '2',
      serviceId: {
        _id: 'service2',
        name: 'Catering',
        provider: {
          _id: 'provider2',
          name: 'Delicious Foods'
        }
      },
      userId: {
        _id: 'user1',
        name: 'Jane Doe',
        email: 'jane@example.com'
      },
      date: '2025-05-20',
      time: '18:00',
      guests: 100,
      message: 'Please include vegetarian options',
      status: 'pending' as const,
      createdAt: '2025-03-05T14:30:00.000Z'
    },
    {
      _id: '3',
      serviceId: {
        _id: 'service3',
        name: 'DJ Services',
        provider: {
          _id: 'provider3',
          name: 'Music Masters'
        }
      },
      userId: {
        _id: 'user1',
        name: 'Jane Doe',
        email: 'jane@example.com'
      },
      date: '2025-06-10',
      time: '20:00',
      guests: 75,
      message: 'Please focus on 80s and 90s hits',
      status: 'cancelled' as const,
      createdAt: '2025-03-10T09:15:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem('token', 'fake-token');
  });

  test('renderiza el componente correctamente sin bookings', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<UserBookings />);
    
    expect(screen.getByTestId('user-bookings-title')).toHaveTextContent('My Bookings');
    expect(screen.getByTestId('bookings-table')).toBeInTheDocument();
    
    // Verificar que se llamó a axios con los parámetros correctos
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/bookings/user',
      {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      }
    );
  });

  test('carga y muestra bookings correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBookings });
    
    render(<UserBookings />);
    
    await waitFor(() => {
      expect(screen.getByTestId('booking-row-1')).toBeInTheDocument();
    });
    
    // Verificar datos de la primera reserva
    expect(screen.getByTestId('service-name-1')).toHaveTextContent('Wedding Photography');
    expect(screen.getByTestId('provider-name-1')).toHaveTextContent('Photo Pro');
    expect(screen.getByTestId('status-1')).toHaveTextContent('Confirmed');
    
    // Verificar que existe el botón de chat para la reserva confirmada
    expect(screen.getByTestId('chat-button-1')).toBeInTheDocument();
    
    // Verificar segunda reserva (pending)
    expect(screen.getByTestId('status-2')).toHaveTextContent('Pending');
    expect(screen.queryByTestId('chat-button-2')).not.toBeInTheDocument();
    
    // Verificar tercera reserva (cancelled)
    expect(screen.getByTestId('status-3')).toHaveTextContent('Cancelled');
    expect(screen.queryByTestId('chat-button-3')).not.toBeInTheDocument();
  });

  test('maneja errores al cargar bookings', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    render(<UserBookings />);
    
    await waitFor(() => {
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('success-modal')).toHaveTextContent('Error fetching bookings. Please try again.');
    
    // Cerrar el modal
    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(screen.queryByTestId('success-modal')).not.toBeInTheDocument();
  });

  test('no intenta cargar bookings si no hay token', () => {
    window.localStorage.clear(); // Eliminar el token
    
    render(<UserBookings />);
    
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  test('abre y cierra el chat modal correctamente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBookings });
    
    render(<UserBookings />);
    
    await waitFor(() => {
      expect(screen.getByTestId('booking-row-1')).toBeInTheDocument();
    });
    
    // Abrir el chat modal
    fireEvent.click(screen.getByTestId('chat-button-1'));
    
    // Verificar que el chat modal está abierto con la información correcta
    expect(screen.getByTestId('chat-modal')).toBeInTheDocument();
    expect(screen.getByTestId('chat-modal')).toHaveTextContent('Chat with Photo Pro');
    expect(screen.getByTestId('chat-modal')).toHaveTextContent('Service ID: service1');
    expect(screen.getByTestId('chat-modal')).toHaveTextContent('User ID: user1');
    
    // Cerrar el chat modal
    fireEvent.click(screen.getByTestId('chat-modal-close-button'));
    expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument();
  });

  test('maneja el caso de datos de servicio/proveedor nulos o incompletos', async () => {
    const incompleteBookings = [
      {
        _id: '4',
        serviceId: null,
        userId: {
          _id: 'user1',
          name: 'Jane Doe',
          email: 'jane@example.com'
        },
        date: '2025-07-15',
        time: '12:00',
        guests: 25,
        message: 'Test message',
        status: 'confirmed' as const,
        createdAt: '2025-03-15T10:00:00.000Z'
      },
      {
        _id: '5',
        serviceId: {
          _id: 'service5',
          name: 'Venue Rental',
          provider: null
        },
        userId: {
          _id: 'user1',
          name: 'Jane Doe',
          email: 'jane@example.com'
        },
        date: '2025-08-01',
        time: '16:00',
        guests: 150,
        message: 'Another test message',
        status: 'confirmed' as const,
        createdAt: '2025-03-20T15:45:00.000Z'
      }
    ];
    
    mockedAxios.get.mockResolvedValueOnce({ data: incompleteBookings });
    
    render(<UserBookings />);
    
    await waitFor(() => {
      expect(screen.getByTestId('booking-row-4')).toBeInTheDocument();
    });
    
    // Verificar que se maneja correctamente el caso de serviceId nulo
    expect(screen.getByTestId('service-name-4')).toHaveTextContent('N/A');
    expect(screen.getByTestId('provider-name-4')).toHaveTextContent('N/A');
    
    // Verificar que se maneja correctamente el caso de provider nulo
    expect(screen.getByTestId('service-name-5')).toHaveTextContent('Venue Rental');
    expect(screen.getByTestId('provider-name-5')).toHaveTextContent('N/A');
    
    // Verificar que el botón de chat maneja correctamente los datos faltantes
    fireEvent.click(screen.getByTestId('chat-button-4'));
    expect(screen.getByTestId('chat-modal')).toHaveTextContent('Chat with N/A');
    expect(screen.getByTestId('chat-modal')).toHaveTextContent('Service ID:');
  });

  test('renderiza correctamente diferentes estados de bookings', async () => {
    const bookingsWithDifferentStatuses = [
      {
        ...mockBookings[0],
        _id: '6',
        status: 'confirmed' as const
      },
      {
        ...mockBookings[0],
        _id: '7',
        status: 'pending' as const
      },
      {
        ...mockBookings[0],
        _id: '8',
        status: 'cancelled' as const
      },
      {
        ...mockBookings[0],
        _id: '9',
        status: 'rejected' as const
      },
      {
        ...mockBookings[0],
        _id: '10',
        status: null as any // Caso de estado nulo
      }
    ];
    
    mockedAxios.get.mockResolvedValueOnce({ data: bookingsWithDifferentStatuses });
    
    render(<UserBookings />);
    
    await waitFor(() => {
      expect(screen.getByTestId('booking-row-6')).toBeInTheDocument();
    });
    
    // Verificar los diferentes estilos de status
    expect(screen.getByTestId('status-6').firstChild).toHaveClass('bg-green-200');
    expect(screen.getByTestId('status-7').firstChild).toHaveClass('bg-yellow-200');
    expect(screen.getByTestId('status-8').firstChild).toHaveClass('bg-red-200');
    expect(screen.getByTestId('status-9').firstChild).toHaveClass('bg-red-200');
    
    // Verificar que status nulo se maneja correctamente
    expect(screen.getByTestId('status-10').firstChild).toHaveClass('bg-gray-200');
    expect(screen.getByTestId('status-10')).toHaveTextContent('N/A');
  });

  test('muestra correctamente las fechas y horas formateadas', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBookings });
    
    render(<UserBookings />);
    
    await waitFor(() => {
      expect(screen.getByTestId('booking-row-1')).toBeInTheDocument();
    });
    
    // La implementación exacta puede variar dependiendo de la configuración regional
    // pero verificamos que las fechas se estén formateando
    expect(screen.getByTestId('reservation-date-1')).not.toHaveTextContent('2025-03-01T12:00:00.000Z');
    expect(screen.getByTestId('event-date-1')).not.toHaveTextContent('2025-04-15');
    expect(screen.getByTestId('event-time-1')).toHaveTextContent('14:00');
  });
});