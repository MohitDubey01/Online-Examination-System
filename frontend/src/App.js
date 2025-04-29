import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Placeholder components (to be created in separate files)
const ExamList = () => <div>Exam List Page</div>;
const TakeExam = () => <div>Take Exam Page</div>;
const Results = () => <div>Results Page</div>;

// Protected Route Component
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Switch>
          <ProtectedRoute exact path="/" component={DashboardPage} />
          <ProtectedRoute exact path="/exams" component={ExamList} />
          <ProtectedRoute exact path="/exams/:id" component={TakeExam} />
          <ProtectedRoute exact path="/results" component={Results} />
          <Route exact path="/login" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default App;