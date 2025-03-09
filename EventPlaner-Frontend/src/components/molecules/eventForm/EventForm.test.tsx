import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import EventForm from './EventForm';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock para localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => {
      return store[key] || null; 
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('EventForm Component', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
    localStorageMock.setItem('token', 'test-token');
  });

  it('renders the form correctly', () => {
    render(<EventForm onClose={mockOnClose} />);
    
    // Verificar título del formulario
    expect(screen.getByText('Create New Event')).toBeInTheDocument();
    
    // Verificar todos los campos del formulario
    expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Attendees/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Image/i)).toBeInTheDocument();
    
    // Verificar botones
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<EventForm onClose={mockOnClose} />);
    
    // Click en el botón de cancelar
    fireEvent.click(screen.getByText('Cancel'));
    
    // Verificar que se llamó a onClose
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles form input changes correctly', () => {
    render(<EventForm onClose={mockOnClose} />);
    
    // Obtener los elementos de entrada
    const titleInput = screen.getByLabelText(/Event Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const categorySelect = screen.getByLabelText(/Category/i);
    const maxAttendeesInput = screen.getByLabelText(/Max Attendees/i);
    
    // Simular cambios en los campos
    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(dateInput, { target: { value: '2025-03-08' } });
    fireEvent.change(timeInput, { target: { value: '14:30' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });
    fireEvent.change(categorySelect, { target: { value: 'Birthday' } });
    fireEvent.change(maxAttendeesInput, { target: { value: '100' } });
    
    // Verificar que los valores se actualizaron correctamente
    expect(titleInput).toHaveValue('Test Event');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(dateInput).toHaveValue('2025-03-08');
    expect(timeInput).toHaveValue('14:30');
    expect(locationInput).toHaveValue('Test Location');
    expect(categorySelect).toHaveValue('Birthday');
    expect(maxAttendeesInput).toHaveValue(100);
  });

  it('handles file input change correctly', async () => {
    render(<EventForm onClose={mockOnClose} />);
    
    // Crear un archivo ficticio
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    
    // Obtener el input de archivo
    const fileInput = screen.getByLabelText(/Event Image/i) as HTMLInputElement;
    
    // Simular la carga de un archivo
    await userEvent.upload(fileInput, file);
    
    // Verificar que el archivo se cargó correctamente
    expect(fileInput.files?.[0]).toEqual(file);
    expect(fileInput.files?.length).toBe(1);
  });

  it('submits the form with all fields correctly', async () => {
    // Mock de respuesta exitosa de axios
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    
    render(<EventForm onClose={mockOnClose} />);
    
    // Rellenar todos los campos
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-03-08' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '14:30' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Birthday' } });
    fireEvent.change(screen.getByLabelText(/Max Attendees/i), { target: { value: '100' } });
    
    // Crear un archivo ficticio para la imagen
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/Event Image/i), file);
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Create Event'));
    
    // Verificar que axios.post fue llamado con los parámetros correctos
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/events',
        expect.any(FormData),
        {
          headers: {
            Authorization: 'Bearer test-token',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    });
    
    // Verificar que onClose fue llamado después del envío exitoso
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles form submission with required fields only', async () => {
    // Mock de respuesta exitosa de axios
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    
    render(<EventForm onClose={mockOnClose} />);
    
    // Rellenar solo los campos requeridos (no incluye imagen)
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-03-08' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '14:30' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Birthday' } });
    fireEvent.change(screen.getByLabelText(/Max Attendees/i), { target: { value: '100' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Create Event'));
    
    // Verificar que axios.post fue llamado
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
    
    // Verificar que onClose fue llamado después del envío exitoso
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles error during form submission', async () => {
    // Espiar console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock de error de axios
    const errorMessage = 'Network Error';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<EventForm onClose={mockOnClose} />);
    
    // Rellenar los campos requeridos
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-03-08' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '14:30' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Birthday' } });
    fireEvent.change(screen.getByLabelText(/Max Attendees/i), { target: { value: '100' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Create Event'));
    
    // Verificar que axios.post fue llamado
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
    
    // Verificar que se registró el error
    expect(consoleSpy).toHaveBeenCalledWith('Error creating event:', expect.any(Error));
    
    // Verificar que onClose NO fue llamado después de un error
    expect(mockOnClose).not.toHaveBeenCalled();
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  it('handles form submission without token', async () => {
    // Eliminar el token
    localStorageMock.removeItem('token');
    
    // Mock de respuesta exitosa de axios
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    
    render(<EventForm onClose={mockOnClose} />);
    
    // Rellenar los campos requeridos
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-03-08' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '14:30' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Birthday' } });
    fireEvent.change(screen.getByLabelText(/Max Attendees/i), { target: { value: '100' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Create Event'));
    
    // Verificar que axios.post fue llamado con un token nulo
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://eventplannerbackend.onrender.com/api/events',
        expect.any(FormData),
        {
          headers: {
            Authorization: 'Bearer null',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    });
  });

  it('correctly appends formData values when submitting', async () => {
    // Mock de respuesta exitosa de axios
    mockedAxios.post.mockImplementation((_, data) => {
      // Verificar que FormData tiene los valores correctos
      const formData = data as FormData;
      expect(formData.get('title')).toBe('Test Event');
      expect(formData.get('description')).toBe('Test Description');
      expect(formData.get('date')).toBe('2025-03-08');
      expect(formData.get('time')).toBe('14:30');
      expect(formData.get('location')).toBe('Test Location');
      expect(formData.get('category')).toBe('Birthday');
      expect(formData.get('maxAttendees')).toBe('100');
      
      return Promise.resolve({ data: { success: true } });
    });
    
    render(<EventForm onClose={mockOnClose} />);
    
    // Rellenar todos los campos
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-03-08' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '14:30' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Birthday' } });
    fireEvent.change(screen.getByLabelText(/Max Attendees/i), { target: { value: '100' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Create Event'));
    
    // Esperar a que axios.post sea llamado
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });
});