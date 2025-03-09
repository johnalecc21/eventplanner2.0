// src/components/organisms/bookingModal/BookingModal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingModal from './BookingModal';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mockear axios
jest.mock('axios');

// Mockear localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mockToken'),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(() => null),
  },
  writable: true,
});

// Mockear lucide-react
jest.mock('lucide-react', () => ({
  X: () => <svg data-testid="close-icon" />,
}));

describe('BookingModal Component', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    service: {
      _id: 'service123',
      name: 'Sample Service',
    },
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when the user is logged in', () => {
    render(
      <MemoryRouter>
        <BookingModal {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent(/Book Sample Service/i);
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByTestId('time-input')).toBeInTheDocument();
    expect(screen.getByTestId('guests-input')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button')).toBeInTheDocument();
  });

  it('does not render the modal when the user is not logged in', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    render(
      <MemoryRouter>
        <BookingModal {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('booking-modal')).toBeNull();
  });

  it('updates form fields correctly', () => {
    render(
      <MemoryRouter>
        <BookingModal {...defaultProps} />
      </MemoryRouter>
    );

    // Date
    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    expect(dateInput).toHaveValue('2023-12-31');

    // Time
    const timeInput = screen.getByTestId('time-input');
    fireEvent.change(timeInput, { target: { value: '18:00' } });
    expect(timeInput).toHaveValue('18:00');

    // Guests
    const guestsInput = screen.getByTestId('guests-input');
    fireEvent.change(guestsInput, { target: { value: '10' } });
    expect(guestsInput).toHaveValue(10); // '10' es una cadena

    // Message
    const messageInput = screen.getByTestId('message-input');
    fireEvent.change(messageInput, { target: { value: 'This is a test booking.' } });
    expect(messageInput).toHaveValue('This is a test booking.');
  });

  it('submits the form with correct data', async () => {
    const mockResponse = {
      _id: 'booking123',
      date: '2023-12-31',
      time: '18:00',
      guests: '10',
      message: 'This is a test booking.',
      userId: 'user456',
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    // Mockear localStorage.getItem para userId
    (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return 'mockToken';
      if (key === 'userId') return 'user456';
      return null;
    });

    render(
      <MemoryRouter>
        <BookingModal {...defaultProps} />
      </MemoryRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByTestId('time-input'), { target: { value: '18:00' } });
    fireEvent.change(screen.getByTestId('guests-input'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'This is a test booking.' } });

    // Submit the form
    fireEvent.click(screen.getByTestId('confirm-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });

    // Check that axios.post was called with the correct data
    expect(axios.post).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/services/service123/book',
      {
        date: '2023-12-31',
        time: '18:00',
        guests: '10',
        message: 'This is a test booking.',
        userId: 'user456',
      },
      {
        headers: {
          Authorization: 'Bearer mockToken',
        },
      }
    );
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <MemoryRouter>
        <BookingModal {...defaultProps} />
      </MemoryRouter>
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

});