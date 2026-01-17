import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Types</h1>
      <Link to="/availability" className="text-blue-500 underline mr-4">Manage Availability</Link>
      <div className="mt-4">
        <p>List of events will go here...</p>
      </div>
    </div>
  );
};

export default Dashboard;