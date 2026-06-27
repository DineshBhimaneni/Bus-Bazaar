import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('buses');
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const [formData, setFormData] = useState({
    bus_name: '', bus_number: '', bus_type: 'A/C Seater', total_seats: 40,
    source: '', destination: '', journey_date: '', departure_time: '', arrival_time: '', fare: ''
  });

  useEffect(() => {
    if (user && (user.email === 'admin@apsrtc.com' || user.email === 'dineshbhimaneni007@gmail.com')) {
      fetchBuses();
      fetchBookings();
      fetchUsers();
    }
  }, [user]);

  if (!user || (user.email !== 'admin@apsrtc.com' && user.email !== 'dineshbhimaneni007@gmail.com')) {
    return <Navigate to="/" />;
  }

  const fetchBuses = async () => {
    try {
      const response = await api.get('/buses');
      setBuses(response.data);
    } catch (error) {
      console.error('Failed to fetch buses', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/admin/all');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClick = () => {
    setEditingBus(null);
    setFormData({
      bus_name: '', bus_number: '', bus_type: 'A/C Seater', total_seats: 40,
      source: '', destination: '', journey_date: '', departure_time: '', arrival_time: '', fare: ''
    });
    setShowModal(true);
  };

  const handleEditClick = (bus) => {
    setEditingBus(bus);
    setFormData({
      bus_name: bus.bus_name, bus_number: bus.bus_number, bus_type: bus.bus_type,
      total_seats: bus.total_seats, source: bus.source, destination: bus.destination,
      journey_date: bus.journey_date.substring(0, 10), departure_time: bus.departure_time,
      arrival_time: bus.arrival_time, fare: bus.fare
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const doDelete = async () => {
    try {
      await api.delete(`/buses/${confirmDelete}`);
      showToast('Bus deleted successfully');
      setConfirmDelete(null);
      fetchBuses();
    } catch (error) {
      console.error('Failed to delete bus', error);
      showToast('Failed to delete bus', 'error');
      setConfirmDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await api.put(`/buses/${editingBus.route_id}`, formData);
        showToast('Bus updated successfully');
      } else {
        await api.post('/buses', formData);
        showToast('New bus added successfully');
      }
      setShowModal(false);
      fetchBuses();
    } catch (error) {
      console.error('Failed to save bus', error);
      showToast('Failed to save bus details', 'error');
    }
  };

  const renderBusesTab = () => (
    <>
      <header className="admin-header">
        <h1>Manage Buses</h1>
        <button className="btn-primary" onClick={handleAddClick}>+ Add New Bus</button>
      </header>
      <div className="admin-card card">
        {loading ? (
          <p style={{padding: '20px'}}>Loading buses...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Operator</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.length > 0 ? buses.map(bus => (
                <tr key={bus.route_id}>
                  <td>{bus.route_id}</td>
                  <td>{bus.bus_name} ({bus.bus_type})</td>
                  <td>{bus.source} → {bus.destination}</td>
                  <td>{bus.journey_date.substring(0, 10)} {bus.departure_time}</td>
                  <td>₹{bus.fare}</td>
                  <td>
                    <button className="btn-action edit" onClick={() => handleEditClick(bus)}>Edit</button>
                    <button className="btn-action delete" onClick={() => handleDeleteClick(bus.route_id)}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No buses found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  const renderBookingsTab = () => (
    <>
      <header className="admin-header">
        <h1>All Bookings</h1>
        <span className="admin-count">{bookings.length} total bookings</span>
      </header>
      <div className="admin-card card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Passenger</th>
              <th>User Email</th>
              <th>Route</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.passenger_name}</td>
                <td>{b.user_email}</td>
                <td>{b.source} → {b.destination}</td>
                <td>{b.journey_date ? b.journey_date.substring(0, 10) : '-'}</td>
                <td>{b.seat_numbers}</td>
                <td>₹{b.total_fare}</td>
                <td>
                  <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderUsersTab = () => (
    <>
      <header className="admin-header">
        <h1>Registered Users</h1>
        <span className="admin-count">{users.length} total users</span>
      </header>
      <div className="admin-card card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registered On</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="admin-dashboard">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal-content" style={{maxWidth:'400px', textAlign:'center'}} onClick={(e) => e.stopPropagation()}>
            <h2>Delete Bus?</h2>
            <p style={{color:'#6b7280', margin:'12px 0 24px'}}>This will permanently delete this route. This action cannot be undone.</p>
            <div className="admin-modal-actions" style={{justifyContent:'center'}}>
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Keep It</button>
              <button className="btn-primary" style={{background:'#ef4444', border:'none'}} onClick={doDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className={activeTab === 'buses' ? 'active' : ''} onClick={() => setActiveTab('buses')}>
              🚌 Manage Buses
            </li>
            <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
              🎫 View Bookings
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              👥 Users
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-content">
        {activeTab === 'buses' && renderBusesTab()}
        {activeTab === 'bookings' && renderBookingsTab()}
        {activeTab === 'users' && renderUsersTab()}

        {/* Modal for Add / Edit Bus */}
        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingBus ? 'Edit Bus / Route' : 'Add New Bus'}</h2>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Operator Name</label>
                    <input type="text" name="bus_name" value={formData.bus_name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Bus Number</label>
                    <input type="text" name="bus_number" value={formData.bus_number} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bus Type</label>
                    <select name="bus_type" value={formData.bus_type} onChange={handleInputChange}>
                      <option value="A/C Seater">A/C Seater</option>
                      <option value="Non A/C Seater">Non A/C Seater</option>
                      <option value="A/C Sleeper">A/C Sleeper</option>
                      <option value="Non A/C Sleeper">Non A/C Sleeper</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Total Seats</label>
                    <input type="number" name="total_seats" value={formData.total_seats} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Source</label>
                    <input type="text" name="source" value={formData.source} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Destination</label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Journey Date</label>
                    <input type="date" name="journey_date" value={formData.journey_date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Fare (₹)</label>
                    <input type="number" name="fare" value={formData.fare} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Departure Time</label>
                    <input type="time" name="departure_time" value={formData.departure_time} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Arrival Time</label>
                    <input type="time" name="arrival_time" value={formData.arrival_time} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="admin-modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">{editingBus ? 'Update Bus' : 'Add Bus'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
