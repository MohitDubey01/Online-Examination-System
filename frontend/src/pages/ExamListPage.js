import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/examList.css';

const ExamListPage = () => {
  const history = useHistory();
  const { user } = useSelector(state => state.auth);
  
  // Mock exam data (will be replaced with API calls later)
  const [exams] = useState([
    {
      id: 1,
      title: 'Mathematics - Algebra',
      description: 'Test your knowledge of algebraic expressions and equations.',
      duration: 60,
      totalQuestions: 20,
      startDate: '2025-05-10T10:00:00',
      endDate: '2025-05-20T23:59:59',
      status: 'available'
    },
    {
      id: 2,
      title: 'Physics - Mechanics',
      description: 'Fundamental concepts of classical mechanics and Newton\'s laws.',
      duration: 90,
      totalQuestions: 25,
      startDate: '2025-05-12T09:00:00',
      endDate: '2025-05-22T23:59:59',
      status: 'available'
    },
    {
      id: 3,
      title: 'Computer Science - Data Structures',
      description: 'Understanding essential data structures and their implementation.',
      duration: 120,
      totalQuestions: 30,
      startDate: '2025-05-15T14:00:00',
      endDate: '2025-05-25T23:59:59',
      status: 'available'
    },
    {
      id: 4,
      title: 'English Literature',
      description: 'Analysis of literary works and comprehension skills.',
      duration: 45,
      totalQuestions: 15,
      startDate: '2025-04-20T10:00:00',
      endDate: '2025-04-25T23:59:59',
      status: 'expired'
    }
  ]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'available':
        return 'status-available';
      case 'expired':
        return 'status-expired';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const handleTakeExam = (examId) => {
    history.push(`/exams/${examId}`);
  };

  const handleGoBack = () => {
    history.push('/');
  };

  return (
    <div className="exam-list-container">
      <header className="exam-list-header">
        <h1>Available Exams</h1>
        <button onClick={handleGoBack} className="back-button">Back to Dashboard</button>
      </header>

      <div className="exam-list-content">
        <div className="exams-grid">
          {exams.map(exam => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <h3>{exam.title}</h3>
                <span className={`exam-status ${getStatusClass(exam.status)}`}>
                  {exam.status === 'available' ? 'Available' : 
                   exam.status === 'expired' ? 'Expired' : 'Completed'}
                </span>
              </div>
              
              <div className="exam-card-body">
                <p>{exam.description}</p>
                
                <div className="exam-details">
                  <div className="exam-detail">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{exam.duration} minutes</span>
                  </div>
                  
                  <div className="exam-detail">
                    <span className="detail-label">Questions:</span>
                    <span className="detail-value">{exam.totalQuestions}</span>
                  </div>
                  
                  <div className="exam-detail">
                    <span className="detail-label">Available From:</span>
                    <span className="detail-value">{formatDate(exam.startDate)}</span>
                  </div>
                  
                  <div className="exam-detail">
                    <span className="detail-label">Available Until:</span>
                    <span className="detail-value">{formatDate(exam.endDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="exam-card-footer">
                <button 
                  onClick={() => handleTakeExam(exam.id)} 
                  className="take-exam-button"
                  disabled={exam.status !== 'available'}
                >
                  {exam.status === 'available' ? 'Take Exam' : 
                   exam.status === 'completed' ? 'View Results' : 'Expired'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamListPage;