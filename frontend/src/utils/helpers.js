/**
 * Format date to a readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Calculate the time remaining for an exam
 * @param {string} endDateString - ISO date string for end date
 * @returns {Object} - Object containing days, hours, minutes remaining
 */
export const calculateTimeRemaining = (endDateString) => {
  const endDate = new Date(endDateString);
  const now = new Date();
  
  // Time difference in milliseconds
  const diff = endDate - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  // Convert to days, hours, minutes, seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, expired: false };
};

/**
 * Get exam status label
 * @param {boolean} isActive - Is exam active
 * @param {string} startDate - ISO start date string
 * @param {string} endDate - ISO end date string
 * @returns {Object} - Object containing status label and color
 */
export const getExamStatus = (isActive, startDate, endDate) => {
  const now = new Date();
  const examStart = startDate ? new Date(startDate) : null;
  const examEnd = endDate ? new Date(endDate) : null;
  
  if (!isActive) {
    return { label: 'Inactive', color: 'error' };
  }
  
  if (examStart && now < examStart) {
    return { label: 'Upcoming', color: 'info' };
  }
  
  if (examEnd && now > examEnd) {
    return { label: 'Expired', color: 'error' };
  }
  
  return { label: 'Active', color: 'success' };
};

/**
 * Calculate percentage
 * @param {number} obtained - Obtained value
 * @param {number} total - Total value
 * @returns {number} - Percentage
 */
export const calculatePercentage = (obtained, total) => {
  if (!total || total === 0) return 0;
  return (obtained / total) * 100;
};

/**
 * Format time in seconds to minutes:seconds format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return 'N/A';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${mins}m ${secs}s`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is email valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};