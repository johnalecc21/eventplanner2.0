// src/components/atoms/modal/Modal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: onCloseMock,
    onConfirm: onConfirmMock,
    title: 'Test Title',
    message: 'This is a test message.',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultProps.message)).not.toBeInTheDocument();
  });

  it('should render the modal with correct title and message when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
  });

  it('should call onClose when clicking the close button', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByTestId('close-button'); 
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking the cancel button', () => {
    render(<Modal {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when clicking the confirm button', () => {
    render(<Modal {...defaultProps} />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose if no onConfirm is provided', () => {
    render(<Modal {...defaultProps} onConfirm={undefined} />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should not render cancel button if cancelButtonText is not provided', () => {
    render(<Modal {...defaultProps} cancelButtonText={undefined} />);
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
  });
});