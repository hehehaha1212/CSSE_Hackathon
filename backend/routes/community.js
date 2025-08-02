const express = require('express');
const router = express.Router();

// Mock community data
const posts = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://via.placeholder.com/40',
    content: 'Just completed the "Meatless Monday" challenge! Saved 0.8kg CO2 today. Who else is trying plant-based meals?',
    likes: 24,
    comments: 8,
    timestamp: '2024-01-15T10:30:00Z',
    type: 'challenge_completion'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mike Chen',
    userAvatar: 'https://via.placeholder.com/40',
    content: 'Switched to public transport this week and already seeing a difference in my carbon footprint!',
    likes: 18,
    comments: 5,
    timestamp: '2024-01-14T15:45:00Z',
    type: 'achievement'
  }
];

// Get community posts
router.get('/posts', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    res.json({
      posts: paginatedPosts,
      total: posts.length,
      page: parseInt(page),
      totalPages: Math.ceil(posts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a post
router.post('/posts', (req, res) => {
  try {
    const { content, type = 'general' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }
    
    const newPost = {
      id: Date.now().toString(),
      userId: '1', // Mock user ID
      userName: 'John Doe',
      userAvatar: 'https://via.placeholder.com/40',
      content: content.trim(),
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      type
    };

    posts.unshift(newPost);
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like a post
router.post('/posts/:id/like', (req, res) => {
  try {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes += 1;
    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get community stats
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalMembers: 2450,
      totalPosts: 1250,
      totalLikes: 8900,
      totalCO2Saved: 15200,
      activeToday: 450
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching community stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = [
      { rank: 1, name: 'Sarah Johnson', points: 2500, co2Saved: 45.2 },
      { rank: 2, name: 'Mike Chen', points: 2200, co2Saved: 38.7 },
      { rank: 3, name: 'Emma Wilson', points: 1950, co2Saved: 32.1 },
      { rank: 4, name: 'David Brown', points: 1800, co2Saved: 28.9 },
      { rank: 5, name: 'Lisa Garcia', points: 1650, co2Saved: 25.4 }
    ];

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 