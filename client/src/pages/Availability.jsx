import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Availability = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize default state
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await api.get('/availability');
      const data = {};
      
      // Convert array to object for easier access { "Monday": { start: "09:00", end: "17:00" } }
      res.data.forEach(item => {
        data[item.day_of_week] = { 
            start: item.start_time.slice(0, 5), // Remove seconds
            end: item.end_time.slice(0, 5) 
        };
      });
      setSchedule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (day) => {
    // If exists, remove it (toggle off). If not, add default 9-5 (toggle on).
    if (schedule[day]) {
      const newSchedule = { ...schedule };
      delete newSchedule[day];
      setSchedule(newSchedule);
      // Optional: API call to delete availability would go here
    } else {
      setSchedule({
        ...schedule,
        [day]: { start: '09:00', end: '17:00' }
      });
    }
  };

  const handleTimeChange = (day, type, value) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], [type]: value }
    });
  };

  const handleSave = async () => {
    try {
      // Save each active day to the backend
      const promises = Object.keys(schedule).map(day => {
        return api.post('/availability', {
          day,
          startTime: schedule[day].start,
          endTime: schedule[day].end
        });
      });

      await Promise.all(promises);
      alert('Availability saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save availability.');
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto pt-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Availability</h1>
            <p className="text-slate-500 mt-1">Configure the times when you are available for bookings.</p>
        </div>
        <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium">
            ← Back
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
            {DAYS.map((day) => {
                const isAvailable = !!schedule[day];
                return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-4 w-40">
                            {/* Toggle Switch */}
                            <button 
                                onClick={() => handleToggle(day)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${isAvailable ? 'bg-slate-900' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <span className={`font-medium ${isAvailable ? 'text-slate-900' : 'text-gray-400'}`}>
                                {day}
                            </span>
                        </div>

                        {isAvailable ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="time" 
                                    value={schedule[day].start}
                                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="time" 
                                    value={schedule[day].end}
                                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                            </div>
                        ) : (
                            <div className="text-gray-400 text-sm italic">Unavailable</div>
                        )}
                    </div>
                );
            })}
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
            <button 
                onClick={handleSave}
                className="px-6 py-2 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition shadow-sm"
            >
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default Availability;