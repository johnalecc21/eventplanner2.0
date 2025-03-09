import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Bookings from './Bookings';
import { act } from 'react-dom/test-utils';

// Mock de los componentes
jest.mock('../../components/atoms/modal/Modal', () => ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;
  return (
    <div data-testid="mock-modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onClose} data-testid="modal-cancel-button">
        Cancel
      </button>
      <button onClick={onConfirm} data-testid="modal-confirm-button">
        Confirm
      </button>
    </div>
  );
});

jest.mock('../../components/atoms/chatModal/ChatModal', () => ({ isOpen, onClose, providerName, serviceId, userId }: {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  serviceId: string;
  userId: string;
}) => {
  if (!isOpen) return null;
  return (
    <div data-testid="mock-chat-modal">
      <h2>Chat with {providerName}</h2>
      <button onClick={onClose} data-testid="chat-modal-close-button">Close</button>
      <div data-testid="chat-service-id">{serviceId}</div>
      <div data-testid="chat-user-id">{userId}</div>
    </div>
  );
});

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = { token: 'fake-token' };
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Bookings Component', () => {
  // Datos de muestra para pruebas
  const mockBookings = [
    {
      _id: 'booking1',
      serviceId: {
        _id: 'service1',
        name: 'Wedding Photography',
        providerId: {
          _id: 'provider1'
        }
      },
      userId: {
        _id: 'user1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      date: '2023-12-15T00:00:00.000Z',
      time: '14:00',
      guests: 100,
      message: 'Looking forward to this event',
      status: 'pending',
      createdAt: '2023-11-01T10:30:00.000Z'
    },
    {
      _id: 'booking2',
      serviceId: {
        _id: 'service2',
        name: 'Catering Service',
        providerId: {
          _id: 'provider2'
        }
      },
      userId: {
        _id: 'user2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      date: '2023-12-20T00:00:00.000Z',
      time: '18:00',
      guests: 50,
      message: 'Please prepare vegetarian options',
      status: 'confirmed',
      createdAt: '2023-11-05T09:15:00.000Z'
    },
    {
      _id: 'booking3',
      serviceId: {
        _id: 'service3',
        name: 'DJ Services',
        providerId: {
          _id: 'provider3'
        }
      },
      userId: {
        _id: 'user3',
        name: 'Bob Johnson',
        email: 'bob@example.com'
      },
      date: '2023-12-25T00:00:00.000Z',
      time: '20:00',
      guests: 150,
      message: 'Please play pop music',
      status: 'rejected',
      createdAt: '2023-11-08T14:20:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar mock para obtener reservas
    mockedAxios.get.mockImplementation((url) => {
      if (url === 'https://eventplannerbackend.onrender.com/api/bookings/provider') {
        return Promise.resolve({ data: mockBookings });
      } else if (url.includes('/api/bookings/booking1')) {
        return Promise.resolve({
          data: {
            ...mockBookings[0],
            status: 'confirmed'
          }
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('should render bookings table with data', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Verificar que el título y la tabla se renderizan
    expect(screen.getByTestId('bookings-title')).toHaveTextContent('Bookings');
    expect(screen.getByTestId('bookings-table')).toBeInTheDocument();

    // Verificar que se muestran las filas de reservas
    expect(screen.getByTestId('booking-row-booking1')).toBeInTheDocument();
    expect(screen.getByTestId('booking-row-booking2')).toBeInTheDocument();
    expect(screen.getByTestId('booking-row-booking3')).toBeInTheDocument();

    // Verificar que se hace la llamada a la API con el token correcto
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/bookings/provider',
      {
        headers: {
          Authorization: 'Bearer fake-token'
        }
      }
    );
  });

  test('should display booking details correctly', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Verificar detalles de la primera reserva
    expect(screen.getByTestId('service-name-booking1')).toHaveTextContent('Wedding Photography');
    expect(screen.getByTestId('client-name-booking1')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('client-email-booking1')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('guests-booking1')).toHaveTextContent('100');
    expect(screen.getByTestId('message-booking1')).toHaveTextContent('Looking forward to this event');
    expect(screen.getByTestId('status-booking1')).toHaveTextContent('Pending');
  });

  test('should display correct action buttons based on booking status', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Reserva pendiente debería tener botones de confirmar y rechazar
    expect(screen.getByTestId('confirm-button-booking1')).toBeInTheDocument();
    expect(screen.getByTestId('reject-button-booking1')).toBeInTheDocument();

    // Reserva confirmada debería tener botón de chat
    expect(screen.getByTestId('chat-button-booking2')).toBeInTheDocument();

    // Reserva rechazada no debería tener botones de acción
    expect(screen.queryByTestId('confirm-button-booking3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reject-button-booking3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chat-button-booking3')).not.toBeInTheDocument();
  });

  test('should open confirm modal when confirm button is clicked', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Hacer clic en el botón de confirmar
    fireEvent.click(screen.getByTestId('confirm-button-booking1'));

    // Verificar que se muestra el modal de confirmación
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Confirm Booking')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to confirm this booking?')).toBeInTheDocument();
  });

  test('should open reject modal when reject button is clicked', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Hacer clic en el botón de rechazar
    fireEvent.click(screen.getByTestId('reject-button-booking1'));

    // Verificar que se muestra el modal de rechazo
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Reject Booking')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to reject this booking?')).toBeInTheDocument();
  });

  test('should open chat modal when chat button is clicked', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Hacer clic en el botón de chat
    fireEvent.click(screen.getByTestId('chat-button-booking2'));

    // Verificar que se muestra el modal de chat
    expect(screen.getByTestId('mock-chat-modal')).toBeInTheDocument();
    expect(screen.getByText('Chat with Jane Smith')).toBeInTheDocument();
    expect(screen.getByTestId('chat-service-id')).toHaveTextContent('service2');
    expect(screen.getByTestId('chat-user-id')).toHaveTextContent('user2');
  });

  test('should close confirm modal when cancel button is clicked', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Abrir el modal de confirmación
    fireEvent.click(screen.getByTestId('confirm-button-booking1'));
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

    // Hacer clic en el botón de cancelar
    fireEvent.click(screen.getByTestId('modal-cancel-button'));

    // Verificar que el modal se cierra
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  test('should close reject modal when cancel button is clicked', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Abrir el modal de rechazo
    fireEvent.click(screen.getByTestId('reject-button-booking1'));
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

    // Hacer clic en el botón de cancelar
    fireEvent.click(screen.getByTestId('modal-cancel-button'));

    // Verificar que el modal se cierra
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  test('should close chat modal when close button is clicked', async () => {
    await act(async () => {
      render(<Bookings />);
    });

    // Abrir el modal de chat
    fireEvent.click(screen.getByTestId('chat-button-booking2'));
    expect(screen.getByTestId('mock-chat-modal')).toBeInTheDocument();

    // Hacer clic en el botón de cerrar
    fireEvent.click(screen.getByTestId('chat-modal-close-button'));

    // Verificar que el modal se cierra
    expect(screen.queryByTestId('mock-chat-modal')).not.toBeInTheDocument();
  });

  test('should confirm booking when confirm button in modal is clicked', async () => {
    // Mock para la petición PUT de confirmación
    mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });

    await act(async () => {
      render(<Bookings />);
    });

    // Abrir el modal de confirmación
    fireEvent.click(screen.getByTestId('confirm-button-booking1'));

    // Confirmar la reserva
    fireEvent.click(screen.getByTestId('modal-confirm-button'));

    // Verificar que se llama a la API para confirmar la reserva
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/bookings/booking1/confirm',
      {},
      {
        headers: {
          Authorization: 'Bearer fake-token'
        }
      }
    );

    // Verificar que se obtiene la reserva actualizada
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/bookings/booking1',
        {
          headers: {
            Authorization: 'Bearer fake-token'
          }
        }
      );
    });
  });

  test('should reject booking when confirm button in reject modal is clicked', async () => {
    // Mock para la petición PUT de rechazo
    mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });

    await act(async () => {
      render(<Bookings />);
    });

    // Abrir el modal de rechazo
    fireEvent.click(screen.getByTestId('reject-button-booking1'));

    // Rechazar la reserva
    fireEvent.click(screen.getByTestId('modal-confirm-button'));

    // Verificar que se llama a la API para rechazar la reserva
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/bookings/booking1/reject',
      {},
      {
        headers: {
          Authorization: 'Bearer fake-token'
        }
      }
    );
  });

  test('should handle error when fetching bookings', async () => {
    // Configurar mock para simular un error
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    await act(async () => {
      render(<Bookings />);
    });
    
    // Verificar que se maneja el error
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching bookings:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test('should handle error when confirming booking', async () => {
    // Configurar mock para simular un error en la confirmación
    mockedAxios.put.mockRejectedValueOnce(new Error('Network Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    await act(async () => {
      render(<Bookings />);
    });
    
    // Abrir el modal de confirmación y confirmar
    fireEvent.click(screen.getByTestId('confirm-button-booking1'));
    fireEvent.click(screen.getByTestId('modal-confirm-button'));
    
    // Verificar que se maneja el error
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error confirming booking:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('should handle error when rejecting booking', async () => {
    // Configurar mock para simular un error en el rechazo
    mockedAxios.put.mockRejectedValueOnce(new Error('Network Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    await act(async () => {
      render(<Bookings />);
    });
    
    // Abrir el modal de rechazo y confirmar
    fireEvent.click(screen.getByTestId('reject-button-booking1'));
    fireEvent.click(screen.getByTestId('modal-confirm-button'));
    
    // Verificar que se maneja el error
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error rejecting booking:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('should handle missing token', async () => {
    // Configurar mock para simular que no hay token
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    await act(async () => {
      render(<Bookings />);
    });
    
    // Verificar que no se llama a la API
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  test('should handle missing token when confirming booking', async () => {
    // Configurar mocks
    mockedAxios.put.mockImplementation(() => Promise.resolve({ data: { success: true } }));
    
    await act(async () => {
      render(<Bookings />);
    });
    
    // Simular que no hay token al confirmar
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    // Abrir el modal de confirmación y confirmar
    fireEvent.click(screen.getByTestId('confirm-button-booking1'));
    fireEvent.click(screen.getByTestId('modal-confirm-button'));
    
    // Verificar que no se llama a la API
    expect(mockedAxios.put).not.toHaveBeenCalled();
  });

  test('should handle missing token when rejecting booking', async () => {
    // Configurar mocks
    mockedAxios.put.mockImplementation(() => Promise.resolve({ data: { success: true } }));
    
    await act(async () => {
      render(<Bookings />);
    });
    
    // Simular que no hay token al rechazar
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    // Abrir el modal de rechazo y confirmar
    fireEvent.click(screen.getByTestId('reject-button-booking1'));
    fireEvent.click(screen.getByTestId('modal-confirm-button'));
    
    // Verificar que no se llama a la API
    expect(mockedAxios.put).not.toHaveBeenCalled();
  });
});