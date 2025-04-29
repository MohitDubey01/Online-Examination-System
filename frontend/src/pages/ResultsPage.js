import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/results.css';

const ResultsPage = () => {
  const history = useHistory();
  
  // Mock results data (will be replaced with API calls)
  const [results] = useState([
    {
      id: 1,
      examId: 1,
      examTitle: 'Mathematics - Algebra',
      date: '2025-04-15T14:30:00',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      duration: 45, // minutes taken
      status: 'passed'
    },
    {
      id: 2,
      examId: 2,
      examTitle: 'Physics - Mechanics',
      date: '2025-04-10T11:15:00',
      score: 72,
      totalQuestions: 25,
      correctAnswers: 18,
      duration: 60,
      status: 'passed'
    },
    {
      id: 3,
      examId: 3,
      examTitle: 'Computer Science - Data Structures',
      date: '2025-04-05T09:45:00',
      score: 60,
      totalQuestions: 30,
      correctAnswers: 18,
      duration: 85,
      status: 'passed'
    }
  ]);
  
  const [selectedResult, setSelectedResult] = useState(null);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleViewResult = (resultId) => {
    setSelectedResult(results.find(r => r.id === resultId));
  };
  
  const handleCloseDetail = () => {
    setSelectedResult(null);
  };
  
  const handleGoBack = () => {
    history.push('/');
  };
  
  const getGradeColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 70) return '#8bc34a';
    if (score >= 60) return '#ffc107';
    return '#f44336';
  };
  
  const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  
  return (
    <div className="results-container">
      <header className="results-header">
        <h1>Exam Results</h1>
        <button onClick={handleGoBack} className="back-button">Back to Dashboard</button>
      </header>
      
      <div className="results-content">
        {selectedResult ? (
          <div className="result-detail">
            <div className="result-detail-header">
              <h2>{selectedResult.examTitle}</h2>
              <button onClick={handleCloseDetail} className="close-button">
                Close Details
              </button>
            </div>
            
            <div className="score-summary">
              <div 
                className="score-circle" 
                style={{ 
                  backgroundColor: getGradeColor(selectedResult.score),
                  color: selectedResult.score < 70 ? '#fff' : '#fff'
                }}
              >
                {selectedResult.score}%
              </div>
              <div className="grade-info">
                <h3>Grade: {getLetterGrade(selectedResult.score)}</h3>
                <p>
                  You answered <strong>{selectedResult.correctAnswers}</strong> out of{' '}
                  <strong>{selectedResult.totalQuestions}</strong> questions correctly.
                </p>
                <p>
                  Time taken: <strong>{selectedResult.duration} minutes</strong>
                </p>
                <p>
                  Date: <strong>{formatDate(selectedResult.date)}</strong>
                </p>
              </div>
            </div>
            
            <div className="result-stats">
              <h3>Performance Breakdown</h3>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-value">
                    {Math.round((selectedResult.correctAnswers / selectedResult.totalQuestions) * 100)}%
                  </div>
                  <div className="stat-label">Accuracy</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">
                    {Math.round(selectedResult.duration / selectedResult.totalQuestions)} min
                  </div>
                  <div className="stat-label">Avg. Time per Question</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">
                    {selectedResult.status === 'passed' ? 'Pass' : 'Fail'}
                  </div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="review-button">Review Answers</button>
              <button className="certificate-button">Download Certificate</button>
            </div>
          </div>
        ) : (
          <div className="results-table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id}>
                    <td>{result.examTitle}</td>
                    <td>{formatDate(result.date)}</td>
                    <td>
                      <span 
                        className="score-badge"
                        style={{ backgroundColor: getGradeColor(result.score) }}
                      >
                        {result.score}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${result.status}`}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewResult(result.id)}
                        className="view-button"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;