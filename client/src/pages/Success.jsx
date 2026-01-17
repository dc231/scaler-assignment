import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">Booking Confirmed!</h1>
      <p className="mt-2">You will receive an email shortly.</p>
      <Link to="/" className="text-blue-500 mt-4 block">Back to Home</Link>
    </div>
  );
};

export default Success;