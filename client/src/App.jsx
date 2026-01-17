import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Availability from './pages/Availability';
import BookingPage from './pages/BookingPage';
import Success from './pages/Success';
import Bookings from './pages/Bookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/bookings" element={<Bookings />}/>
          
          {/* Public Routes */}
          <Route path="/:user/:slug" element={<BookingPage />} /> {/* e.g. /admin/15min */}
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;