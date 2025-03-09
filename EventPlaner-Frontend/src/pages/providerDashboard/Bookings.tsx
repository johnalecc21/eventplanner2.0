// pages/providerDashboard/Bookings.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, MessageSquare } from 'lucide-react';
import 'tailwindcss/tailwind.css';
import Modal from '../../components/atoms/modal/Modal';
import ChatModal from '../../components/atoms/chatModal/ChatModal';

interface Booking {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
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

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; bookingId: string | null }>({ isOpen: false, bookingId: null });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; bookingId: string | null }>({ isOpen: false, bookingId: null });
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
      const response = await axios.get<Booking[]>('https://eventplannerbackend.onrender.com/api/bookings/provider', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.put(`https://eventplannerbackend.onrender.com/api/bookings/${bookingId}/confirm`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await axios.get(`https://eventplannerbackend.onrender.com/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const confirmedBooking = response.data;
        openChatModal(
          confirmedBooking.serviceId.providerId?._id,
          confirmedBooking.serviceId._id,
          confirmedBooking.userId._id
        );
        fetchBookings(token);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.put(`https://eventplannerbackend.onrender.com/api/bookings/${bookingId}/reject`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchBookings(token);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const openConfirmModal = (bookingId: string) => {
    setConfirmModal({ isOpen: true, bookingId });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, bookingId: null });
  };

  const openRejectModal = (bookingId: string) => {
    setRejectModal({ isOpen: true, bookingId });
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, bookingId: null });
  };

  const confirmBooking = () => {
    if (confirmModal.bookingId) {
      handleConfirm(confirmModal.bookingId);
      closeConfirmModal();
    }
  };

  const rejectBooking = () => {
    if (rejectModal.bookingId) {
      handleReject(rejectModal.bookingId);
      closeRejectModal();
    }
  };

  const openChatModal = (providerName: string, serviceId: string, userId: string) => {
    setChatModal({ isOpen: true, providerName, serviceId, userId });
  };

  const closeChatModal = () => {
    setChatModal({ isOpen: false, providerName: '', serviceId: '', userId: '' });
  };

  return (
    <div className="space-y-8" data-testid="bookings-container">
      <h1 className="text-3xl font-bold text-primary" data-testid="bookings-title">Bookings</h1>
      <div className="overflow-x-auto rounded-3xl">
        <table className="min-w-full backdrop-blur-lg rounded-3xl shadow-md glass-effect" data-testid="bookings-table">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Client Email</th>
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
              <tr key={booking._id} className="hover:bg-primary text-gray-600 border" data-testid={`booking-row-${booking._id}`}>
                <td className="p-4" data-testid={`service-name-${booking._id}`}>{booking.serviceId?.name || 'N/A'}</td>
                <td className="p-4" data-testid={`client-name-${booking._id}`}>{booking.userId?.name || 'N/A'}</td>
                <td className="p-4" data-testid={`client-email-${booking._id}`}>{booking.userId?.email || 'N/A'}</td>
                <td className="p-4" data-testid={`reservation-date-${booking._id}`}>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td className="p-4" data-testid={`event-date-${booking._id}`}>{new Date(booking.date).toLocaleDateString()}</td>
                <td className="p-4" data-testid={`event-time-${booking._id}`}>{booking.time}</td>
                <td className="p-4" data-testid={`guests-${booking._id}`}>{booking.guests}</td>
                <td className="p-4" data-testid={`message-${booking._id}`}>{booking.message}</td>
                <td className="p-4">
                  {booking.status ? (
                    <span
                      className={`px-3 py-1 rounded-full ${
                        booking.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                      data-testid={`status-${booking._id}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800" data-testid={`status-${booking._id}`}>N/A</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openConfirmModal(booking._id)}
                          className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                          data-testid={`confirm-button-${booking._id}`}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openRejectModal(booking._id)}
                          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                          data-testid={`reject-button-${booking._id}`}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() =>
                          openChatModal(
                            booking.userId.name,
                            booking.serviceId._id,
                            booking.userId._id
                          )
                        }
                        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        data-testid={`chat-button-${booking._id}`}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmBooking}
        title="Confirm Booking"
        message="Are you sure you want to confirm this booking?"
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
        data-testid="confirm-modal"
      />

      <Modal
        isOpen={rejectModal.isOpen}
        onClose={closeRejectModal}
        onConfirm={rejectBooking}
        title="Reject Booking"
        message="Are you sure you want to reject this booking?"
        confirmButtonText="Reject"
        cancelButtonText="Cancel"
        data-testid="reject-modal"
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

export default Bookings;