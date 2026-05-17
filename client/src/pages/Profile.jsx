import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Mock Bookings
  const mockBookings = [
    {
      id: 'BK12345',
      date: '2026-06-15',
      from: 'Hyderabad',
      to: 'Vijayawada',
      status: 'Confirmed',
      amount: 850
    },
    {
      id: 'BK98765',
      date: '2026-04-10',
      from: 'Bangalore',
      to: 'Chennai',
      status: 'Completed',
      amount: 1200
    }
  ];

  return (
    <div className="profile-page container">
      <div className="profile-header card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="bookings-section">
        <h3>My Bookings</h3>
        <div className="bookings-list">
          {mockBookings.map(booking => (
            <div key={booking.id} className="booking-card card">
              <div className="booking-header">
                <span className="booking-id">Booking ID: {booking.id}</span>
                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <div className="route">
                  {booking.from} ➔ {booking.to}
                </div>
                <div className="date">Date: {booking.date}</div>
                <div className="amount">Amount: ₹{booking.amount}</div>
              </div>
              <div className="booking-actions">
                <button className="btn-secondary">View Ticket</button>
                {booking.status === 'Confirmed' && (
                  <button className="btn-secondary text-red">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
