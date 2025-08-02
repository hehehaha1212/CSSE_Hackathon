const express = require('express');
const router = express.Router();

// Mock carbon data - in real app, this would come from database
const carbonData = [
  { date: '2024-01-01', value: 2.4 },
  { date: '2024-01-02', value: 3.1 },
  { date: '2024-01-03', value: 2.8 },
  { date: '2024-01-04', value: 1.9 },
  { date: '2024-01-05', value: 2.6 },
  { date: '2024-01-06', value: 1.5 },
  { date: '2024-01-07', value: 2.2 }
];

// Get carbon footprint data
router.get('/data', (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    // Mock data based on period
    let data;
    switch (period) {
      case 'week':
        data = carbonData;
        break;
      case 'month':
        data = Array.from({ length: 30 }, (_, i) => ({
          date: `2024-01-${String(i + 1).padStart(2, '0')}`,
          value: Math.random() * 4 + 1
        }));
        break;
      case 'year':
        data = Array.from({ length: 12 }, (_, i) => ({
          date: `2024-${String(i + 1).padStart(2, '0')}`,
          value: Math.random() * 100 + 50
        }));
        break;
      default:
        data = carbonData;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching carbon data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Log activity
router.post('/activity', (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ message: 'Type and data are required' });
    }
    
    // Mock activity logging
    const activity = {
      id: Date.now().toString(),
      type,
      data,
      carbonFootprint: Math.random() * 3 + 0.5, // Mock calculation
      timestamp: new Date().toISOString()
    };

    res.status(201).json(activity);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get activity breakdown
router.get('/breakdown', (req, res) => {
  try {
    const breakdown = [
      { name: 'Transportation', value: 45, color: '#ef4444' },
      { name: 'Food', value: 25, color: '#f59e0b' },
      { name: 'Energy', value: 20, color: '#3b82f6' },
      { name: 'Waste', value: 10, color: '#8b5cf6' }
    ];

    res.json(breakdown);
  } catch (error) {
    console.error('Error fetching breakdown:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get recommendations
router.get('/recommendations', (req, res) => {
  try {
    const recommendations = [
      {
        id: '1',
        title: 'Switch to public transport',
        description: 'Take the bus or train instead of driving to work',
        impact: 2.5,
        category: 'Transportation',
        completed: false
      },
      {
        id: '2',
        title: 'Reduce meat consumption',
        description: 'Try meatless Mondays or switch to plant-based alternatives',
        impact: 1.8,
        category: 'Food',
        completed: false
      },
      {
        id: '3',
        title: 'Use energy-efficient appliances',
        description: 'Replace old appliances with Energy Star certified ones',
        impact: 1.2,
        category: 'Energy',
        completed: true
      }
    ];

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 