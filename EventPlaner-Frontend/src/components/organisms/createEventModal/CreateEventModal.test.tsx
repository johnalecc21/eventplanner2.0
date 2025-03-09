// src/components/organisms/createEventModal/CreateEventModal.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateEventModal from './CreateEventModal';
import { MemoryRouter } from 'react-router-dom';


// Mockear EventForm para evitar dependencias innecesarias
jest.mock('../../molecules/eventForm/EventForm', () => () => <div data-testid="mock-event-form" />);

// Mockear useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateEventModal Component', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal container and initial content', () => {
    render(
      <MemoryRouter>
        <CreateEventModal {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent(/Create New Event/i);
    expect(screen.getByTestId('browse-marketplace')).toBeInTheDocument();
    expect(screen.getByTestId('create-event')).toBeInTheDocument();
    expect(screen.getByTestId('browse-icon')).toBeInTheDocument();
    expect(screen.getByTestId('create-icon')).toBeInTheDocument();
    expect(screen.getByTestId('browse-title')).toHaveTextContent(/Browse Marketplace/i);
    expect(screen.getByTestId('create-title')).toHaveTextContent(/Create Event/i);
    expect(screen.getByTestId('browse-description')).toHaveTextContent(/Find and connect with service providers for your event./i);
    expect(screen.getByTestId('create-description')).toHaveTextContent(/Start planning your event from scratch./i);

    // Verificar que el formulario no se renderice inicialmente
    expect(screen.queryByTestId('mock-event-form')).toBeNull();
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <MemoryRouter>
        <CreateEventModal {...defaultProps} />
      </MemoryRouter>
    );

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('navigates to marketplace when Browse Marketplace option is clicked', () => {
    render(
      <MemoryRouter>
        <CreateEventModal {...defaultProps} />
      </MemoryRouter>
    );

    const browseMarketplaceOption = screen.getByTestId('browse-marketplace');
    fireEvent.click(browseMarketplaceOption);
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/marketplace');
  });

  it('shows the event form when Create Event option is clicked', () => {
    render(
      <MemoryRouter>
        <CreateEventModal {...defaultProps} />
      </MemoryRouter>
    );

    const createEventOption = screen.getByTestId('create-event');
    fireEvent.click(createEventOption);

    // Verificar que el formulario se renderice
    expect(screen.getByTestId('mock-event-form')).toBeInTheDocument();
  });

  it('does not render the event form initially', () => {
    render(
      <MemoryRouter>
        <CreateEventModal {...defaultProps} />
      </MemoryRouter>
    );

    // Verificar que el formulario no se renderice inicialmente
    expect(screen.queryByTestId('mock-event-form')).toBeNull();
  });
});