import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockBuses } from '../data/mockData';
import BusCard from '../components/BusCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const navigate = useNavigate();

  // For demonstration, just using all mock buses or filtering if they match
  const filteredBuses = mockBuses.filter(bus => 
    (!from || bus.from === from) && (!to || bus.to === to)
  );

  const handleModifySearch = () => {
    navigate('/');
  };

  return (
    <div className="search-results-page container">
      <div className="search-header">
        <div className="search-info">
          <h2>{from || 'Anywhere'} to {to || 'Anywhere'}</h2>
          <p>{date ? new Date(date).toDateString() : 'Any Date'}</p>
        </div>
        <button className="btn-secondary" onClick={handleModifySearch}>
          Modify Search
        </button>
      </div>

      <div className="results-container">
        <div className="filters-sidebar card">
          <h3>Filters</h3>
          <div className="filter-group">
            <h4>Bus Type</h4>
            <label><input type="checkbox" /> A/C</label>
            <label><input type="checkbox" /> Non A/C</label>
            <label><input type="checkbox" /> Sleeper</label>
            <label><input type="checkbox" /> Seater</label>
          </div>
          <div className="filter-group">
            <h4>Price Range</h4>
            <input type="range" min="0" max="3000" className="price-slider" />
          </div>
        </div>

        <div className="bus-list">
          <h3>{filteredBuses.length} Buses Found</h3>
          {filteredBuses.length > 0 ? (
            filteredBuses.map(bus => (
              <BusCard key={bus.id} bus={bus} />
            ))
          ) : (
            <div className="no-buses card">
              <p>No buses found for this route. Try different dates or locations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
