import React from 'react';
import { mockSeats } from '../data/mockData';
import './SeatMap.css';

const SeatMap = ({ selectedSeats, onSeatSelect }) => {
  return (
    <div className="seat-map-container">
      <div className="bus-layout">
        <div className="driver-cabin">
          <div className="steering-wheel"></div>
        </div>
        <div className="seats-grid">
          {mockSeats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.id);
            const isBooked = seat.status === 'booked';
            
            return (
              <button
                key={seat.id}
                className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : 'available'}`}
                disabled={isBooked}
                onClick={() => onSeatSelect(seat.id)}
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
