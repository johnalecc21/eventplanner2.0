// pages/userDashboard/UserBookings.tsx
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

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBookings(token);
    }
  }, []);

  const fetchBookings = async (token: string) => {
    try {
      const response = await axios.get<Booking[]>('http://localhost:5001/api/bookings/user', {
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">My Bookings</h1>
      <div className="overflow-x-auto rounded-3xl">
        <table className="min-w-full backdrop-blur-lg rounded-3xl shadow-md glass-effect">
          <thead className="bg-primary text-white">
            <tr>
              <th className="border p-4">Service Name</th>
              <th className="border p-4">Reservation Date</th>
              <th className="border p-4">Event Date</th>
              <th className="border p-4">Time</th>
              <th className="border p-4">Guests</th>
              <th className="border p-4">Message</th>
              <th className="border p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-primary text-gray-200">
                <td className="border p-4">{booking.serviceId?.name || 'N/A'}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Success/Error Modal */}
      <Modal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title="Booking Status"
        message={successModal.message}
        confirmButtonText="Close"
      />
    </div>
  );
};

export default UserBookings;