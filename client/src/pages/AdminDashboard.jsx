import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockBuses } from '../data/mockData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Simple mock check for admin
  if (!user || user.email !== 'admin@apsrtc.com') {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className="active">Manage Buses</li>
            <li>Manage Routes</li>
            <li>View Bookings</li>
            <li>Users</li>
          </ul>
        </nav>
      </aside>
      
      <main className="admin-content">
        <header className="admin-header">
          <h1>Manage Buses</h1>
          <button className="btn-primary">+ Add New Bus</button>
        </header>
        
        <div className="admin-card card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Operator</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBuses.map(bus => (
                <tr key={bus.id}>
                  <td>{bus.id}</td>
                  <td>{bus.operator}</td>
                  <td>{bus.from} - {bus.to}</td>
                  <td>{bus.departureTime}</td>
                  <td>₹{bus.price}</td>
                  <td>
                    <button className="btn-action edit">Edit</button>
                    <button className="btn-action delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
