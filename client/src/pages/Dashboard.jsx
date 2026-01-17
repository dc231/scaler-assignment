import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', duration: 15, slug: '', description: '' });

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/event-types');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/event-types', formData);
      setShowModal(false);
      setFormData({ title: '', duration: 15, slug: '', description: '' });
      fetchEvents(); // Refresh list
    } catch (err) {
      alert('Error creating event: ' + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event type?')) {
      try {
        await api.delete(`/event-types/${id}`);
        fetchEvents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Helper to copy link to clipboard
  const copyLink = (slug) => {
    const link = `${window.location.origin}/user/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto pt-10 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Event Types</h1>
            <p className="text-slate-500 mt-1">Create events for people to book.</p>
        </div>
        <div className="flex gap-4">
            <Link to="/availability" className="px-4 py-2 text-slate-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition">
                Availability
            </Link>
            <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition shadow-sm"
            >
                + New Event Type
            </button>
        </div>
      </div>

      {/* Grid of Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{evt.title}</h3>
                    <p className="text-sm text-slate-500">{evt.duration} mins • /{evt.slug}</p>
                </div>
                <button onClick={() => handleDelete(evt.id)} className="text-gray-400 hover:text-red-500">
                    ✕
                </button>
            </div>
            <p className="text-slate-600 mt-4 text-sm line-clamp-2 min-h-[40px]">
                {evt.description || "No description provided."}
            </p>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button 
                    onClick={() => copyLink(evt.slug)}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                    📋 Copy Link
                </button>
                <Link to={`/user/${evt.slug}`} className="text-slate-500 text-sm hover:text-slate-900">
                    Preview ↗
                </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Event Type</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 15 Min Meeting"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 p-2 rounded-l-md text-gray-500 text-sm">/</span>
                    <input 
                    type="text" 
                    placeholder="15min"
                    className="w-full border border-gray-300 rounded-r-md p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-md font-medium"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800"
                >
                    Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;