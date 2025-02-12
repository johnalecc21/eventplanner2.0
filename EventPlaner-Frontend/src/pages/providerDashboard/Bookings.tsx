// pages/providerDashboard/Bookings.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';
import 'tailwindcss/tailwind.css'; 
import Modal from '../../components/atoms/modal/Modal';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBookings(token);
    }
  }, []);

  const fetchBookings = async (token: string) => {
    try {
      const response = await axios.get<Booking[]>('http://localhost:5001/api/bookings/provider', {
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
        await axios.put(`http://localhost:5001/api/bookings/${bookingId}/confirm`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        await axios.put(`http://localhost:5001/api/bookings/${bookingId}/reject`, {}, {
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Bookings</h1>
      <div className="overflow-x-auto rounded-3xl">
        <table className="min-w-full backdrop-blur-lg rounded-3xl shadow-md glass-effect">
          <thead className="bg-primary text-white">
            <tr>
              <th className="border p-4">Service Name</th>
              <th className="border p-4">Client Name</th>
              <th className="border p-4">Client Email</th>
              <th className="border p-4">Reservation Date</th>
              <th className="border p-4">Event Date</th>
              <th className="border p-4">Time</th>
              <th className="border p-4">Guests</th>
              <th className="border p-4">Message</th>
              <th className="border p-4">Status</th>
              <th className="border p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-primary text-gray-200">
                <td className="border p-4">{booking.serviceId?.name || 'N/A'}</td>
                <td className="border p-4">{booking.userId?.name || 'N/A'}</td>
                <td className="border p-4">{booking.userId?.email || 'N/A'}</td>
                <td className="border p-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td className="border p-4">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="border p-4">{booking.time}</td>
                <td className="border p-4">{booking.guests}</td>
                <td className="border p-4">{booking.message}</td>
                <td className="border p-4">
                  {booking.status ? (
                    <span className={`px-3 py-1 rounded-full ${booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : booking.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800">N/A</span>
                  )}
                </td>
                <td className="border p-4">
                  {booking.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openConfirmModal(booking._id)}
                        className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openRejectModal(booking._id)}
                        className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmBooking}
        title="Confirm Booking"
        message="Are you sure you want to confirm this booking?"
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
      />

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={closeRejectModal}
        onConfirm={rejectBooking}
        title="Reject Booking"
        message="Are you sure you want to reject this booking?"
        confirmButtonText="Reject"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default Bookings;