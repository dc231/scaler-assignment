import React from 'react';
import { Link } from 'react-router-dom';

const Availability = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Availability Settings</h1>
      <Link to="/" className="text-blue-500 underline">Back to Dashboard</Link>
      <div className="mt-4">
        <p>Availability form will go here...</p>
      </div>
    </div>
  );
};

export default Availability;