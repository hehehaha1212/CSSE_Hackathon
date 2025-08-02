const express = require('express');
const router = express.Router();

// Mock challenges data
const challenges = [
  {
    id: '1',
    title: 'Meatless Monday',
    description: 'Go vegetarian for one day and reduce your carbon footprint',
    category: 'Food',
    difficulty: 'easy',
    duration: 1,
    participants: 1250,
    reward: 50,
    progress: 100,
    completed: true,
    expiresAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Public Transport Week',
    description: 'Use public transportation for an entire week',
    category: 'Transportation',
    difficulty: 'medium',
    duration: 7,
    participants: 890,
    reward: 200,
    progress: 60,
    completed: false,
    expiresAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Energy Saver',
    description: 'Reduce your home energy consumption by 20%',
    category: 'Energy',
    difficulty: 'hard',
    duration: 30,
    participants: 450,
    reward: 500,
    progress: 25,
    completed: false,
    expiresAt: '2024-02-15'
  }
];

// Get all challenges
router.get('/', (req, res) => {
  try {
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get challenge by ID
router.get('/:id', (req, res) => {
  try {
    const challenge = challenges.find(c => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Join challenge
router.post('/:id/join', (req, res) => {
  try {
    const challenge = challenges.find(c => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Mock join logic
    res.json({ message: 'Successfully joined challenge', challenge });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update challenge progress
router.put('/:id/progress', (req, res) => {
  try {
    const { progress } = req.body;
    const challenge = challenges.find(c => c.id === req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be a number between 0 and 100' });
    }

    // Mock progress update
    challenge.progress = Math.min(100, Math.max(0, progress));
    
    if (challenge.progress >= 100) {
      challenge.completed = true;
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Complete challenge
router.post('/:id/complete', (req, res) => {
  try {
    const challenge = challenges.find(c => c.id === req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Mock completion logic
    challenge.completed = true;
    challenge.progress = 100;

    res.json({ 
      message: 'Challenge completed!', 
      challenge,
      pointsEarned: challenge.reward
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 