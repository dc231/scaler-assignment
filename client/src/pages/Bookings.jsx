import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pt-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 mt-1">View and manage upcoming scheduled events.</p>
        </div>
        <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No bookings found yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Event</th>
                <th className="p-4">Attendee</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const isPast = new Date(booking.start_time) < new Date();
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className={`font-medium ${isPast ? 'text-gray-400' : 'text-slate-900'}`}>
                        {format(new Date(booking.start_time), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(booking.start_time), 'h:mm a')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md font-medium">
                        {booking.event_title}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900 font-medium">{booking.booker_name}</div>
                      <div className="text-slate-500 text-sm">{booking.booker_email}</div>
                    </td>
                    <td className="p-4 text-right">
                      {!isPast && (
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                      )}
                      {isPast && <span className="text-gray-400 text-sm italic">Completed</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bookings;