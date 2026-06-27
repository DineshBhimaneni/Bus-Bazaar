import React, { useState, useEffect } from 'react';
import { mockSeats } from '../data/mockData';
import api from '../services/api';
import './SeatMap.css';

const SeatMap = ({ selectedSeats, onSeatSelect, routeId }) => {
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    if (routeId) {
      fetchBookedSeats();
    }
  }, [routeId]);

  const fetchBookedSeats = async () => {
    try {
      const response = await api.get(`/bookings/seats/${routeId}`);
      // response.data is an array of seat numbers like ["1A", "1B", "2C"]
      setBookedSeats(response.data);
    } catch (error) {
      console.error('Failed to fetch booked seats', error);
    }
  };

  return (
    <div className="seat-map-container">
      <div className="bus-layout">
        <div className="driver-cabin">
          <div className="steering-wheel"></div>
        </div>
        <div className="seats-grid">
          {mockSeats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.number);
            // Check if the seat.number is in the bookedSeats array fetched from API
            const isBooked = bookedSeats.includes(seat.number) || (seat.status === 'booked' && !routeId); // fallback for mock
            
            return (
              <button
                key={seat.id}
                className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : 'available'}`}
                disabled={isBooked}
                onClick={() => onSeatSelect(seat.number)}
                title={`Seat ${seat.number}`}
              >
                {seat.number}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available legend-seat"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat booked legend-seat"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat selected legend-seat"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
