import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import api from '../api/axios';
import 'react-calendar/dist/Calendar.css'; // Default styles
import '../calendar-overrides.css'; // Custom Tailwind overrides (we will create this next)

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '' });

  // 1. Load Event Details (MVP: Fetch all and find match)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get('/event-types');
        const found = res.data.find(e => e.slug === slug);
        if (found) setEvent(found);
        else alert('Event not found');
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [slug]);

  // 2. Fetch Slots when Date changes
  useEffect(() => {
    if (event && date) {
      fetchSlots();
      setSelectedSlot(null); // Reset selection
    }
  }, [date, event]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      // Format date as YYYY-MM-DD for API
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await api.get(`/bookings/slots?date=${dateStr}&eventTypeId=${event.id}`);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      // Combine date and time string to full ISO string
      // slot is "09:00", date is Date obj
      const [hours, minutes] = selectedSlot.split(':');
      const startDate = new Date(date);
      startDate.setHours(parseInt(hours), parseInt(minutes));

      await api.post('/bookings', {
        eventTypeId: event.id,
        bookerName: bookingForm.name,
        bookerEmail: bookingForm.email,
        startTime: startDate.toISOString()
      });

      navigate('/success');
    } catch (err) {
      alert('Booking failed: ' + err.response?.data?.message);
    }
  };

  if (!event) return <div className="p-10 text-center">Loading Event...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-200">
        
        {/* Left Panel: Event Info */}
        <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50">
          <div className="sticky top-8">
            <p className="text-slate-500 font-medium mb-1">Your Name</p>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{event.title}</h1>
            <div className="flex items-center text-slate-500 mb-6 space-x-2">
                <span className="text-lg">⏱</span>
                <span>{event.duration} min</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{event.description}</p>
          </div>
        </div>

        {/* Middle Panel: Calendar */}
        <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-6 w-full text-left">Select a Date</h2>
            <Calendar 
                onChange={setDate} 
                value={date} 
                minDate={new Date()}
                className="custom-calendar border-0 w-full"
                tileClassName="rounded-full hover:bg-slate-100"
            />
        </div>

        {/* Right Panel: Slots & Form */}
        <div className="w-full md:w-1/3 p-6 bg-white overflow-y-auto max-h-[600px]">
          {!selectedSlot ? (
            // VIEW A: List of Time Slots
            <>
                <h2 className="text-lg font-semibold mb-4 text-slate-900">
                    {format(date, 'EEEE, MMMM d')}
                </h2>
                <div className="space-y-3">
                    {loadingSlots ? (
                        <p className="text-slate-400">Loading slots...</p>
                    ) : slots.length > 0 ? (
                        slots.map((slot) => (
                        <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className="w-full py-3 px-4 text-center border border-slate-200 text-slate-700 font-semibold rounded-md hover:border-slate-900 hover:ring-1 hover:ring-slate-900 transition"
                        >
                            {slot}
                        </button>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-10 bg-gray-50 rounded-lg">
                            No slots available for this day.
                        </p>
                    )}
                </div>
            </>
          ) : (
            // VIEW B: Booking Form
            <div className="animate-fade-in">
                <button 
                    onClick={() => setSelectedSlot(null)} 
                    className="mb-6 text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                >
                    ← Back to slots
                </button>
                <h2 className="text-xl font-bold mb-1">Confirm Booking</h2>
                <p className="text-slate-500 mb-6">
                    {format(date, 'E, MMM d')} at <span className="text-slate-900 font-semibold">{selectedSlot}</span>
                </p>

                <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-slate-900 outline-none"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-slate-900 text-white py-3 rounded-md font-bold mt-4 hover:bg-slate-800 transition"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingPage;