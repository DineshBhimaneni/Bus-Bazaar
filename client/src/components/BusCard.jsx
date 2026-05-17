import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BusCard.css';

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  const handleSelectSeats = () => {
    navigate(`/bus/${bus.id}`);
  };

  return (
    <div className="bus-card card">
      <div className="bus-info">
        <h3 className="bus-operator">{bus.operator}</h3>
        <p className="bus-type">{bus.type}</p>
        <div className="bus-rating">⭐ {bus.rating}</div>
      </div>
      
      <div className="bus-timing">
        <div className="time-block">
          <span className="time">{bus.departureTime}</span>
          <span className="location">{bus.from}</span>
        </div>
        <div className="duration">
          <span className="duration-text">{bus.duration}</span>
          <div className="duration-line"></div>
        </div>
        <div className="time-block">
          <span className="time">{bus.arrivalTime}</span>
          <span className="location">{bus.to}</span>
        </div>
      </div>
      
      <div className="bus-fare-action">
        <div className="bus-price">₹{bus.price}</div>
        <div className="seats-available">{bus.seatsAvailable} Seats Available</div>
        <button className="btn-primary" onClick={handleSelectSeats}>Select Seats</button>
      </div>
    </div>
  );
};

export default BusCard;
