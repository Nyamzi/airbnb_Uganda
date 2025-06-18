import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Listings from './components/Listings';
import PropertyDetails from './components/PropertyDetails';
import Auth from './components/Auth';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
};

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App; 