import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/takeExam.css';

const TakeExamPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  
  // Mock exam data (will be replaced with API calls)
  const [exam, setExam] = useState({
    id: parseInt(id),
    title: 'Mathematics - Algebra',
    description: 'Test your knowledge of algebraic expressions and equations.',
    duration: 60, // minutes
    instructions: [
      'Read all questions carefully before answering.',
      'You have 60 minutes to complete this exam.',
      'Each question has only one correct answer.',
      'You can navigate between questions using the Previous and Next buttons.',
      'You can mark questions for review and return to them later.',
      'Submit your exam before the time expires.'
    ],
    questions: [
      {
        id: 1,
        text: 'Solve for x: 2x + 5 = 13',
        options: [
          { id: 'a', text: 'x = 4' },
          { id: 'b', text: 'x = 9' },
          { id: 'c', text: 'x = 3' },
          { id: 'd', text: 'x = 6' }
        ],
        correctAnswer: 'a' // This would not be sent to the frontend in a real app
      },
      {
        id: 2,
        text: 'Simplify: 3(2x - 4) + 5',
        options: [
          { id: 'a', text: '6x - 12 + 5' },
          { id: 'b', text: '6x - 7' },
          { id: 'c', text: '6x - 12' },
          { id: 'd', text: '6x - 17' }
        ],
        correctAnswer: 'b' // This would not be sent to the frontend in a real app
      },
      {
        id: 3,
        text: 'Factor completely: x² - 9',
        options: [
          { id: 'a', text: '(x - 3)(x - 3)' },
          { id: 'b', text: '(x - 3)(x + 3)' },
          { id: 'c', text: '(x + 3)(x + 3)' },
          { id: 'd', text: 'x(x - 9)' }
        ],
        correctAnswer: 'b' // This would not be sent to the frontend in a real app
      },
      {
        id: 4,
        text: 'What is the slope of the line passing through points (2, 5) and (4, 9)?',
        options: [
          { id: 'a', text: '1' },
          { id: 'b', text: '2' },
          { id: 'c', text: '3' },
          { id: 'd', text: '4' }
        ],
        correctAnswer: 'b' // This would not be sent to the frontend in a real app
      },
      {
        id: 5,
        text: 'Solve the inequality: 3x - 7 > 2',
        options: [
          { id: 'a', text: 'x > 3' },
          { id: 'b', text: 'x < 3' },
          { id: 'c', text: 'x > 9/3' },
          { id: 'd', text: 'x < 9/3' }
        ],
        correctAnswer: 'a' // This would not be sent to the frontend in a real app
      }
    ]
  });
  
  const [markedQuestions, setMarkedQuestions] = useState(
    new Array(exam.questions.length).fill(false)
  );
  
  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle time up
  const handleTimeUp = () => {
    setIsSubmitting(true);
    // In a real app, this would submit the exam automatically
    setTimeout(() => {
      history.push('/results');
    }, 2000);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Mark/unmark question for review
  const handleMarkQuestion = () => {
    const newMarkedQuestions = [...markedQuestions];
    newMarkedQuestions[currentQuestion] = !newMarkedQuestions[currentQuestion];
    setMarkedQuestions(newMarkedQuestions);
  };
  
  // Navigate to a specific question
  const handleQuestionNav = (index) => {
    setCurrentQuestion(index);
  };
  
  // Handle exam submission
  const handleSubmit = () => {
    if (confirmSubmit) {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        history.push('/results');
      }, 2000);
    } else {
      setConfirmSubmit(true);
    }
  };
  
  // Cancel submission confirmation
  const handleCancelSubmit = () => {
    setConfirmSubmit(false);
  };
  
  // Exit exam without submitting
  const handleExitExam = () => {
    history.push('/exams');
  };
  
  return (
    <div className="take-exam-container">
      <header className="exam-header">
        <div className="exam-title-section">
          <h1>{exam.title}</h1>
          <span className="question-counter">
            Question {currentQuestion + 1} of {exam.questions.length}
          </span>
        </div>
        <div className="timer-section">
          <div className="timer">
            Time Remaining: {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setConfirmSubmit(true)} 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>
      
      <div className="exam-content">
        <div className="question-navigation">
          <h3>Questions</h3>
          <div className="question-buttons">
            {exam.questions.map((question, index) => (
              <button
                key={question.id}
                className={`question-button ${currentQuestion === index ? 'active' : ''} ${
                  answers[question.id] ? 'answered' : ''
                } ${markedQuestions[index] ? 'marked' : ''}`}
                onClick={() => handleQuestionNav(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color current"></span>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-color answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-color marked"></span>
              <span>Marked for Review</span>
            </div>
          </div>
        </div>
        
        <div className="question-content">
          {confirmSubmit ? (
            <div className="confirmation-dialog">
              <h3>Are you sure you want to submit your exam?</h3>
              <p>
                You have answered{' '}
                <strong>
                  {Object.keys(answers).length} out of {exam.questions.length}
                </strong>{' '}
                questions.
              </p>
              <div className="confirmation-buttons">
                <button onClick={handleSubmit} className="confirm-button">
                  Yes, Submit Exam
                </button>
                <button onClick={handleCancelSubmit} className="cancel-button">
                  No, Continue Exam
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="question">
                <h3>Question {currentQuestion + 1}</h3>
                <p>{exam.questions[currentQuestion].text}</p>
                
                <div className="options">
                  {exam.questions[currentQuestion].options.map(option => (
                    <div
                      key={option.id}
                      className={`option ${
                        answers[exam.questions[currentQuestion].id] === option.id
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        handleAnswerSelect(exam.questions[currentQuestion].id, option.id)
                      }
                    >
                      <span className="option-label">{option.id.toUpperCase()}</span>
                      <span className="option-text">{option.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="question-actions">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="nav-button"
                >
                  Previous
                </button>
                <button
                  onClick={handleMarkQuestion}
                  className={`mark-button ${
                    markedQuestions[currentQuestion] ? 'marked' : ''
                  }`}
                >
                  {markedQuestions[currentQuestion]
                    ? 'Unmark for Review'
                    : 'Mark for Review'}
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === exam.questions.length - 1}
                  className="nav-button"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeExamPage;