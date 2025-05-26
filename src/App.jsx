import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoutineLogger from './pages/RoutineLogger';
import ProductTracker from './pages/ProductTracker';
import TaskScheduler from './pages/TaskScheduler';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }}>
        <div className="min-h-screen bg-lavender-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/routines" element={
              <ProtectedRoute>
                <RoutineLogger />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <ProductTracker />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <TaskScheduler />
              </ProtectedRoute>
            } />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;