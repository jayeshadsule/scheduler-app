import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AvailabilityPage from './pages/AvailabilityPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AvailabilityPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/book/:link" element={<BookingPage />} />
          {/* 404 Route */}
          <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px' }}><h1>404 - Page Not Found</h1><p>The booking link you are looking for does not exist or has expired.</p></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
