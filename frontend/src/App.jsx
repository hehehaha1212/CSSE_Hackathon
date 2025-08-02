import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Check if user is authenticated
const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Login />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Login />} 
          />
          <Route 
            path="/challenges" 
            element={user ? <Challenges /> : <Login />} 
          />
          <Route 
            path="/community" 
            element={user ? <Community /> : <Login />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 