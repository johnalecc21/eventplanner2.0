import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ChatModal from './ChatModal';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
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

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('ChatModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    providerName: 'Test Provider',
    serviceId: 'service123',
    userId: 'user456',
  };

  const mockMessages = [
    {
      _id: '1',
      senderId: 'user456',
      receiverId: 'provider789',
      content: 'Hello provider',
      createdAt: '2023-01-01T12:00:00Z',
    },
    {
      _id: '2',
      senderId: 'provider789',
      receiverId: 'user456',
      content: 'Hi there!',
      createdAt: '2023-01-01T12:05:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render when isOpen is false', () => {
    render(<ChatModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('chat-modal-container')).not.toBeInTheDocument();
  });

  test('should render correctly when isOpen is true', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockMessages });
    
    render(<ChatModal {...defaultProps} />);
    
    expect(screen.getByTestId('chat-modal-container')).toBeInTheDocument();
    expect(screen.getByTestId('chat-modal-title')).toHaveTextContent('Chat with Test Provider');
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-message-button')).toBeInTheDocument();
    
    // Verify axios was called with correct params
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/messages',
      {
        params: { serviceId: 'service123', userId: 'user456' },
        headers: { Authorization: 'Bearer fake-token' },
      }
    );

    // Wait for messages to load
    await waitFor(() => {
      expect(screen.getByTestId('message-1')).toBeInTheDocument();
      expect(screen.getByTestId('message-2')).toBeInTheDocument();
    });
  });

  test('should close when clicking the backdrop', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<ChatModal {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('chat-modal-backdrop'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('should close when clicking the close button', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<ChatModal {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('close-chat-modal-button'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('should show "No messages yet" when there are no messages', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    render(<ChatModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('no-messages-text')).toBeInTheDocument();
      expect(screen.getByTestId('no-messages-text')).toHaveTextContent('No messages yet.');
    });
  });

  test('should display messages with correct styling', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockMessages });
    
    render(<ChatModal {...defaultProps} />);
    
    await waitFor(() => {
      // Check user message (right-aligned)
      const userMessage = screen.getByTestId('message-1');
      expect(userMessage).toHaveClass('text-right');
      expect(screen.getByTestId('message-content-1')).toHaveClass('bg-primary');
      expect(screen.getByTestId('message-content-1')).toHaveTextContent('Hello provider');
      
      // Check provider message (left-aligned)
      const providerMessage = screen.getByTestId('message-2');
      expect(providerMessage).toHaveClass('text-left');
      expect(screen.getByTestId('message-content-2')).toHaveClass('bg-gray-200');
      expect(screen.getByTestId('message-content-2')).toHaveTextContent('Hi there!');
    });
  });

  test('should send a message when clicking the send button', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        _id: '3',
        senderId: 'user456',
        receiverId: 'provider789',
        content: 'New test message',
        createdAt: '2023-01-01T13:00:00Z',
      },
    });
    
    render(<ChatModal {...defaultProps} />);
    
    // Type a message
    const input = screen.getByTestId('chat-input');
    await userEvent.type(input, 'New test message');
    
    // Send the message
    const sendButton = screen.getByTestId('send-message-button');
    fireEvent.click(sendButton);
    
    // Verify message was sent with correct data
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/messages',
      { serviceId: 'service123', userId: 'user456', content: 'New test message' },
      {
        headers: {
          Authorization: 'Bearer fake-token',
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Wait for message to appear
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
    
    // Verify scrollToBottom was called
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  test('should send a message when pressing Enter', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        _id: '4',
        senderId: 'user456',
        receiverId: 'provider789',
        content: 'Enter key message',
        createdAt: '2023-01-01T14:00:00Z',
      },
    });
    
    render(<ChatModal {...defaultProps} />);
    
    // Type a message and press Enter
    const input = screen.getByTestId('chat-input');
    await userEvent.type(input, 'Enter key message');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Verify message was sent
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://eventplannerbackend.onrender.com/api/messages',
      { serviceId: 'service123', userId: 'user456', content: 'Enter key message' },
      {
        headers: {
          Authorization: 'Bearer fake-token',
          'Content-Type': 'application/json',
        },
      }
    );
  });

  test('should not send message when input is empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<ChatModal {...defaultProps} />);
    
    // Try to send an empty message
    const sendButton = screen.getByTestId('send-message-button');
    fireEvent.click(sendButton);
    
    // Verify post was not called
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Message is empty');
    
    consoleSpy.mockRestore();
  });

  test('should handle error when fetching messages', async () => {
    const error = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(error);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<ChatModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('An unknown error occurred:', error);
    });
    
    consoleSpy.mockRestore();
  });

  test('should handle axios error when fetching messages', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: 'Error data' },
      message: 'Error message',
    };
    mockedAxios.get.mockRejectedValueOnce(axiosError);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<ChatModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching messages:', 'Error data', 'Error message');
    });
    
    consoleSpy.mockRestore();
  });

  test('should handle error when sending message', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const error = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(error);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<ChatModal {...defaultProps} />);
    
    // Type and send a message
    const input = screen.getByTestId('chat-input');
    await userEvent.type(input, 'Test error message');
    const sendButton = screen.getByTestId('send-message-button');
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('An unknown error occurred:', error);
    });
    
    consoleSpy.mockRestore();
  });

 test('should handle axios error when sending message', async () => {
  // Simula una respuesta exitosa para obtener mensajes
  mockedAxios.get.mockResolvedValueOnce({ data: [] });

  // Simula un error de Axios al enviar un mensaje
  const axiosError = {
    isAxiosError: true,
    response: { data: 'Error data' },
    message: 'Error message',
  };
  mockedAxios.post.mockRejectedValueOnce(axiosError);

  // Espía el console.error
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

  render(<ChatModal {...defaultProps} />);

  // Escribe y envía un mensaje
  const input = screen.getByTestId('chat-input');
  await userEvent.type(input, 'Test error message');
  const sendButton = screen.getByTestId('send-message-button');
  fireEvent.click(sendButton);

  // Verifica que se haya registrado el error correctamente
  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith('Error sending message:', 'Error data', 'Error message');
  });

  // Restaura el console.error
  consoleSpy.mockRestore();
});

  test('should handle missing token when fetching messages', async () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<ChatModal {...defaultProps} />);
    
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('No token found');
    
    consoleSpy.mockRestore();
  });

  test('should handle missing token when sending message', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<ChatModal {...defaultProps} />);
    
    // After initial render, clear mocks and set localStorage to return null
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    // Try to send a message
    const input = screen.getByTestId('chat-input');
    await userEvent.type(input, 'Test message');
    const sendButton = screen.getByTestId('send-message-button');
    fireEvent.click(sendButton);
    
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('No token found');
    
    consoleSpy.mockRestore();
  });

  test('should not fetch messages when modal is closed', async () => {
    render(<ChatModal {...defaultProps} isOpen={false} />);
    
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});