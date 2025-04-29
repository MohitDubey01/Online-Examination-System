import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import '../styles/profile.css';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  
  // State for form data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for feedback message
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate password if user is trying to change it
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ text: 'New passwords do not match', type: 'error' });
        return;
      }
      
      if (!formData.oldPassword) {
        setMessage({ text: 'Please enter your current password', type: 'error' });
        return;
      }
    }
    
    // In a real app, this would be an API call
    // For now, we'll just simulate a successful update
    setTimeout(() => {
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setIsEditing(false);
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }, 1000);
  };
  
  const handleGoBack = () => {
    history.push('/');
  };
  
  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>User Profile</h1>
        <button onClick={handleGoBack} className="back-button">Back to Dashboard</button>
      </header>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.fullName || user?.username}</h2>
            <p className="role-badge">{user?.role || 'Student'}</p>
          </div>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user?.username || ''}
                disabled
                className="disabled"
              />
              <small>Username cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="organization">Organization/School</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            {isEditing && (
              <div className="password-section">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label htmlFor="oldPassword">Current Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            <div className="form-actions">
              {isEditing ? (
                <>
                  <button type="submit" className="save-button">Save Changes</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;