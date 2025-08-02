import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, carbonAPI } from '../services/api';

const defaultStats = {
  totalActivities: 0,
  totalCarbonSaved: 0,
  currentStreak: 0,
  level: 1,
};

const defaultFootprint = {
  daily: 0,
  weekly: 0,
  monthly: 0,
  activities: [
    {
      id: 1,
      type: 'Walking',
      amount: '2 km',
      carbonImpact: 0.3,
      date: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'Recycling',
      amount: '1 bag',
      carbonImpact: 0.5,
      date: new Date().toISOString(),
    },
    {
      id: 3,
      type: 'Public Transport',
      amount: '10 km',
      carbonImpact: 1.2,
      date: new Date().toISOString(),
    },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(defaultStats);
  const [footprint, setFootprint] = useState(defaultFootprint);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(false);

        const [statsResponse, footprintResponse] = await Promise.all([
          userAPI.getStats(),
          carbonAPI.getFootprint(),
        ]);

        setStats(statsResponse?.data || defaultStats);
        setFootprint(footprintResponse?.data || defaultFootprint);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use fallback data on error
        setStats(defaultStats);
        setFootprint(defaultFootprint);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="container">
      <h1>Welcome back, {user?.name || 'Eco Warrior'}!</h1>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
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
                {footprint.activities && footprint.activities.length > 0 ? (
                  footprint.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-amount">{activity.amount}</span>
                      <span className="activity-impact">{activity.carbonImpact} kg CO2</span>
                      <span className="activity-date">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No recent activities to display.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
