const express = require('express');
const router = express.Router();

// Mock user data - in real app, this would come from database
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    carbonFootprint: 2.4,
    level: 5,
    points: 1250,
    avatar: null
  }
];

// Get user stats
router.get('/stats', (req, res) => {
  try {
    // Mock user stats
    const stats = {
      totalCarbonFootprint: 67.2,
      weeklyAverage: 2.3,
      monthlyTotal: 67.2,
      savingsGoal: 75,
      challengesCompleted: 12,
      currentStreak: 7,
      totalPoints: 1250,
      level: 5
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const user = users[0]; // Mock user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    if (!name && !avatar) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }
    
    // Mock update
    const updatedUser = {
      ...users[0],
      name: name || users[0].name,
      avatar: avatar || users[0].avatar
    };

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 