import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import 'tailwindcss/tailwind.css';
import Modal from '../../components/atoms/modal/Modal';
import ChatModal from '../../components/atoms/chatModal/ChatModal';

interface Booking {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
    provider: {
      _id: string;
      name: string;
    };
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  time: string;
  guests: number;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  createdAt: string;
}

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [chatModal, setChatModal] = useState<{ isOpen: boolean; providerName: string; serviceId: string; userId: string }>({
    isOpen: false,
    providerName: '',
    serviceId: '',
    userId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBookings(token);
    }
  }, []);

  const fetchBookings = async (token: string) => {
    try {
      const response = await axios.get<Booking[]>('https://eventplannerbackend.onrender.com/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setSuccessModal({ isOpen: true, message: 'Error fetching bookings. Please try again.' });
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, message: '' });
  };

  const openChatModal = (providerName: string, serviceId: string, userId: string) => {
    setChatModal({ isOpen: true, providerName, serviceId, userId });
  };

  const closeChatModal = () => {
    setChatModal({ isOpen: false, providerName: '', serviceId: '', userId: '' });
  };

  return (
    <div className="space-y-8" data-testid="user-bookings-container">
      <h1 className="text-3xl font-bold text-primary" data-testid="user-bookings-title">
        My Bookings
      </h1>
      <div className="overflow-x-auto rounded-3xl">
        <table className="min-w-full backdrop-blur-lg rounded-3xl shadow-md glass-effect" data-testid="bookings-table">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Provider Name</th>
              <th className="p-4">Reservation Date</th>
              <th className="p-4">Event Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Guests</th>
              <th className="p-4">Message</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border hover:bg-primary" data-testid={`booking-row-${booking._id}`}>
                <td className="p-4" data-testid={`service-name-${booking._id}`}>
                  {booking.serviceId?.name || 'N/A'}
                </td>
                <td className="p-4" data-testid={`provider-name-${booking._id}`}>
                  {booking.serviceId?.provider?.name || 'N/A'}
                </td>
                <td className="p-4" data-testid={`reservation-date-${booking._id}`}>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4" data-testid={`event-date-${booking._id}`}>
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="p-4" data-testid={`event-time-${booking._id}`}>
                  {booking.time}
                </td>
                <td className="p-4" data-testid={`guests-${booking._id}`}>
                  {booking.guests}
                </td>
                <td className="p-4" data-testid={`message-${booking._id}`}>
                  {booking.message}
                </td>
                <td className="p-4" data-testid={`status-${booking._id}`}>
                  {booking.status ? (
                    <span
                      className={`px-3 py-1 rounded-full ${booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : booking.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800">N/A</span>
                  )}
                </td>
                <td className="p-4">
                  {booking.status === 'confirmed' && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                      onClick={() => openChatModal(booking.serviceId?.provider?.name || 'N/A', booking.serviceId?._id || '', booking.userId?._id || '')}
                      data-testid={`chat-button-${booking._id}`}
                    >
                      <MessageSquare size={16} /> Chat
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title="Booking Status"
        message={successModal.message}
        confirmButtonText="Close"
        data-testid="success-modal"
      />
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={closeChatModal}
        providerName={chatModal.providerName}
        serviceId={chatModal.serviceId}
        userId={chatModal.userId}
        data-testid="chat-modal"
      />
    </div>
  );
};

export default UserBookings;