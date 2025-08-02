import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Track Your Carbon Footprint
              <span className="hero-highlight"> Save the Planet</span>
            </h1>
            <p className="hero-description">
              Join thousands of eco-conscious individuals tracking their environmental impact. 
              Make sustainable choices and earn rewards for your green actions.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-visual">
              <div className="carbon-chart">
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '40%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '30%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose CarbonTracker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Tracking</h3>
              <p>Automatically calculate your carbon footprint from daily activities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Eco Challenges</h3>
              <p>Join challenges and earn points for sustainable actions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community</h3>
              <p>Connect with like-minded individuals and share your progress</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Track your impact anywhere, anytime with our responsive design</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50,000</div>
              <div className="stat-label">CO2 kg Saved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Challenges Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 