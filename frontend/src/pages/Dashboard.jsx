import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, carbonAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [footprint, setFootprint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats and carbon footprint in parallel
        const [statsResponse, footprintResponse] = await Promise.all([
          userAPI.getStats(),
          carbonAPI.getFootprint()
        ]);

        setStats(statsResponse.data);
        setFootprint(footprintResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Welcome back, {user?.name}!</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Activities</h3>
            <p className="stat-number">{stats.totalActivities}</p>
          </div>
          <div className="stat-card">
            <h3>Carbon Saved</h3>
            <p className="stat-number">{stats.totalCarbonSaved} kg CO2</p>
          </div>
          <div className="stat-card">
            <h3>Current Streak</h3>
            <p className="stat-number">{stats.currentStreak} days</p>
          </div>
          <div className="stat-card">
            <h3>Level</h3>
            <p className="stat-number">{stats.level}</p>
          </div>
        </div>
      )}

      {footprint && (
        <div className="footprint-section">
          <h2>Your Carbon Footprint</h2>
          <div className="footprint-grid">
            <div className="footprint-card">
              <h3>Daily</h3>
              <p className="footprint-value">{footprint.daily} kg CO2</p>
            </div>
            <div className="footprint-card">
              <h3>Weekly</h3>
              <p className="footprint-value">{footprint.weekly} kg CO2</p>
            </div>
            <div className="footprint-card">
              <h3>Monthly</h3>
              <p className="footprint-value">{footprint.monthly} kg CO2</p>
            </div>
          </div>

          <div className="recent-activities">
            <h3>Recent Activities</h3>
            <div className="activities-list">
              {footprint.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-type">{activity.type}</span>
                  <span className="activity-amount">{activity.amount}</span>
                  <span className="activity-impact">{activity.carbonImpact} kg CO2</span>
                  <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 