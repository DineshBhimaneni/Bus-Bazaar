import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import api from '../services/api';
import './BusDetails.css';

const BusDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const response = await api.get(`/buses/${id}`);
        // Map the backend data to match the expected structure in the component
        const busData = response.data;
        setBus({
          id: busData.route_id,
          operator: busData.bus_name,
          type: busData.bus_type,
          departureTime: busData.departure_time,
          arrivalTime: busData.arrival_time,
          duration: 'N/A', // You can calculate this if needed
          price: busData.fare,
          from: busData.source,
          to: busData.destination,
          busId: busData.bus_id
        });
      } catch (error) {
        console.error('Failed to fetch bus details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{padding: '50px', textAlign: 'center'}}>Loading bus details...</div>;
  }

  if (!bus) {
    return <div className="container" style={{padding: '50px', textAlign: 'center'}}>Bus not found</div>;
  }

  const handleSeatSelect = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Max 6 seats limit
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert('You can only select up to 6 seats.');
      }
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    // Navigate to booking summary, passing state (in a real app, use Context or Redux)
    navigate('/booking', { state: { bus, selectedSeats } });
  };

  const totalFare = selectedSeats.length * bus.price;

  return (
    <div className="bus-details-page container">
      <div className="details-layout">
        <div className="bus-info-section card">
          <h2>{bus.operator}</h2>
          <p className="bus-type">{bus.type}</p>
          <div className="route-info">
            <div className="route-point">
              <h4>{bus.departureTime}</h4>
              <p>{bus.from}</p>
            </div>
            <div className="route-duration">
              <span>{bus.duration}</span>
              <div className="arrow-line"></div>
            </div>
            <div className="route-point">
              <h4>{bus.arrivalTime}</h4>
              <p>{bus.to}</p>
            </div>
          </div>
          
          <div className="amenities">
            <h3>Amenities</h3>
            <div className="amenities-list">
              <span>❄️ A/C</span>
              <span>🔋 Charging Point</span>
              <span>💺 Recliner Seats</span>
              <span>💧 Water Bottle</span>
            </div>
          </div>
          
          <div className="fare-details">
            <h3>Price per seat</h3>
            <p className="price">₹{bus.price}</p>
          </div>
        </div>

        <div className="seat-selection-section card">
          <h3>Select Seats</h3>
          <SeatMap selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} routeId={bus.id} />
          
          {selectedSeats.length > 0 && (
            <div className="selection-summary">
              <div className="summary-row">
                <span>Selected Seats:</span>
                <span className="font-bold">{selectedSeats.length}</span>
              </div>
              <div className="summary-row">
                <span>Total Fare:</span>
                <span className="total-price">₹{totalFare}</span>
              </div>
              <button className="btn-primary w-full mt-4" onClick={handleProceed}>
                Proceed to Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
