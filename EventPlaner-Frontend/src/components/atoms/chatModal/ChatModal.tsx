import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  userName?: string;
  serviceId: string;
  userId: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, providerName, serviceId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        console.log('Fetching messages for:', { serviceId, userId });

        const response = await axios.get<Message[]>('https://eventplannerbackend.onrender.com/api/messages', {
          params: { serviceId, userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching messages:', error.response?.data, error.message);
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
    };

    fetchMessages();
  }, [isOpen, serviceId, userId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      console.warn('Message is empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const messageData = { serviceId, userId, content: newMessage };
      console.log('Sending message:', messageData);

      const response = await axios.post('https://eventplannerbackend.onrender.com/api/messages', messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending message:', error.response?.data, error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="chat-modal-container">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="chat-modal-backdrop"
      />

      <div className="relative glass-effect rounded-xl w-full max-w-lg p-8" data-testid="chat-modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
          data-testid="close-chat-modal-button"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6" data-testid="chat-modal-title">
          Chat with {providerName}
        </h2>

        <div className="h-80 overflow-y-auto mb-4" data-testid="chat-messages-container">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500" data-testid="no-messages-text">
              No messages yet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 ${String(msg.senderId) === String(userId) ? 'text-right' : 'text-left'}`}
                data-testid={`message-${msg._id}`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${String(msg.senderId) === String(userId) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
                  data-testid={`message-content-${msg._id}`}
                >
                  {msg.content}
                </div>
                <div className="text-xs text-gray-400" data-testid={`message-time-${msg._id}`}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} data-testid="messages-end-ref" />
        </div>

        <div className="flex space-x-2" data-testid="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type a message..."
            data-testid="chat-input"
          />
          <button
            onClick={sendMessage}
            className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
            data-testid="send-message-button"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;