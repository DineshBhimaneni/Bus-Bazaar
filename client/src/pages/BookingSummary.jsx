import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BookingSummary.css';

const BookingSummary = () => {
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [passengerDetails, setPassengerDetails] = useState({
    name: user ? user.name : '',
    age: '',
    gender: 'Male',
    email: user ? user.email : '',
    phone: ''
  });

  if (!state || !state.bus || !state.selectedSeats) {
    return <Navigate to="/" />;
  }

  const { bus, selectedSeats } = state;
  const totalFare = selectedSeats.length * bus.price;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails({ ...passengerDetails, [name]: value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to continue booking');
      navigate('/login');
      return;
    }
    
    // MOCK PAYMENT AND BOOKING
    alert('Payment Successful! Booking Confirmed.');
    navigate('/profile');
  };

  return (
    <div className="booking-summary-page container">
      <h2 className="page-title">Booking Summary</h2>
      
      <div className="summary-layout">
        <div className="passenger-section card">
          <h3>Passenger Details</h3>
          <form onSubmit={handlePayment} className="passenger-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={passengerDetails.name} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={passengerDetails.age} onChange={handleInputChange} required min="1" max="120" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={passengerDetails.gender} onChange={handleInputChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="email" value={passengerDetails.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={passengerDetails.phone} onChange={handleInputChange} required pattern="[0-9]{10}" placeholder="10 digit number" />
            </div>
            
            <button type="submit" className="btn-primary w-full mt-4">
              Proceed to Pay ₹{totalFare}
            </button>
          </form>
        </div>

        <div className="fare-section card">
          <h3>Trip Details</h3>
          <div className="trip-info">
            <h4>{bus.operator}</h4>
            <p>{bus.from} ➔ {bus.to}</p>
            <p>{bus.departureTime} - {bus.arrivalTime}</p>
          </div>
          
          <div className="fare-breakdown">
            <div className="breakdown-row">
              <span>Selected Seats:</span>
              <span>{selectedSeats.length} (IDs: {selectedSeats.join(', ')})</span>
            </div>
            <div className="breakdown-row">
              <span>Base Fare:</span>
              <span>₹{totalFare}</span>
            </div>
            <div className="breakdown-row">
              <span>Taxes & Fees:</span>
              <span>₹0</span>
            </div>
            <div className="breakdown-row total">
              <span>Total Amount:</span>
              <span>₹{totalFare}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
