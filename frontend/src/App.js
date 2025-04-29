import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ExamListPage from './pages/ExamListPage';
import TakeExamPage from './pages/TakeExamPage';
import ResultsPage from './pages/ResultsPage';
import ProfilePage from './pages/ProfilePage';

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
          <Redirect to="/auth" />
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
          <ProtectedRoute exact path="/exams" component={ExamListPage} />
          <ProtectedRoute exact path="/exams/:id" component={TakeExamPage} />
          <ProtectedRoute exact path="/results" component={ResultsPage} />
          <ProtectedRoute exact path="/profile" component={ProfilePage} />
          <Route exact path={["/login", "/auth"]} component={AuthPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </div>
  );
}

export default App;