import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push('/auth');
  };

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Online Examination System</h1>
        <div className="user-info">
          <span>Welcome, {user?.username || 'User'}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <h2>Dashboard</h2>
        
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigateTo('/exams')}>
            <h3>Available Exams</h3>
            <p>View and take exams assigned to you</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigateTo('/results')}>
            <h3>Results</h3>
            <p>View your exam results and performance</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>View and update your profile information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;