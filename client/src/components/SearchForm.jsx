import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchForm.css';

const LOCATIONS = ['Hyderabad', 'Vijayawada', 'Vizag', 'Tirupati', 'Kurnool', 'Rajahmundry'];

const SearchForm = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (source && destination && date) {
      // Basic validation
      if (source === destination) {
        alert('Source and destination cannot be the same');
        return;
      }
      navigate(`/search?from=${source}&to=${destination}&date=${date}`);
    }
  };

  return (
    <div className="search-section">
      <div className="search-overlay">
        <div className="search-container container">
          <h1 className="search-title">Book Your Bus Tickets Online</h1>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <label>From</label>
              <input 
                type="text" 
                value={source} 
                onChange={(e) => setSource(e.target.value)} 
                placeholder="Enter Boarding Point" 
                required 
              />
            </div>
            
            <div className="input-group icon-group">
              <span className="swap-icon">⇄</span>
            </div>

            <div className="input-group">
              <label>To</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                placeholder="Enter Dropping Point" 
                required 
              />
            </div>

            <div className="input-group">
              <label>Date of Journey</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="input-group submit-group">
              <button type="submit" className="btn-search">Search Buses</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
