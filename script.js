// Carbon Footprint Tracker - JavaScript

// Global variables
let currentSection = 'home';
let activities = [];
let challenges = [];
let userData = {
    carbonFootprint: 2.4,
    points: 1250,
    level: 5,
    activities: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    setupEventListeners();
    drawWeeklyChart();
});

// Initialize the application
function initializeApp() {
    console.log('🌱 Carbon Footprint Tracker initialized');
    
    // Set up navigation
    setupNavigation();
    
    // Load user data from localStorage if available
    loadUserData();
    
    // Update UI
    updateDashboard();
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Form submissions
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAuthSubmit(this);
        });
    });

    // Modal close events
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update navigation
        updateNavigation(sectionId);
        
        // Special handling for sections
        if (sectionId === 'dashboard') {
            updateDashboard();
        } else if (sectionId === 'track') {
            updateActivitiesList();
        }
    }
}

// Update navigation
function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');
    
    if (navMenu && navAuth) {
        navMenu.classList.toggle('active');
        navAuth.classList.toggle('active');
    }
}

// Show login modal
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Show register modal
function showRegister() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Handle authentication form submission
function handleAuthSubmit(form) {
    const formData = new FormData(form);
    const isLogin = form.closest('#loginModal') !== null;
    
    if (isLogin) {
        // Handle login
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (email && password) {
            // Simulate login
            showNotification('Login successful!', 'success');
            closeModal('loginModal');
            updateUserInterface();
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    } else {
        // Handle registration
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        if (name && email && password) {
            // Simulate registration
            showNotification('Registration successful!', 'success');
            closeModal('registerModal');
            updateUserInterface();
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    }
}

// Log activity
function logActivity() {
    const activityType = document.getElementById('activity-type').value;
    const activityDetails = document.getElementById('activity-details').value;
    const activityAmount = document.getElementById('activity-amount').value;

    if (!activityType || !activityDetails || !activityAmount) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Calculate carbon footprint based on activity type
    const carbonImpact = calculateCarbonImpact(activityType, parseFloat(activityAmount));
    
    // Create activity object
    const activity = {
        id: Date.now(),
        type: activityType,
        details: activityDetails,
        amount: parseFloat(activityAmount),
        carbonImpact: carbonImpact,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };

    // Add to activities array
    activities.unshift(activity);
    userData.activities.unshift(activity);
    
    // Update carbon footprint
    userData.carbonFootprint += carbonImpact;
    
    // Save to localStorage
    saveUserData();
    
    // Update UI
    updateActivitiesList();
    updateDashboard();
    
    // Clear form
    document.getElementById('activity-type').value = '';
    document.getElementById('activity-details').value = '';
    document.getElementById('activity-amount').value = '';
    
    showNotification(`Activity logged! Carbon impact: ${carbonImpact.toFixed(2)} kg CO2`, 'success');
}

// Calculate carbon impact
function calculateCarbonImpact(type, amount) {
    const factors = {
        transport: 0.2, // kg CO2 per km
        food: 0.5,      // kg CO2 per kg
        energy: 0.8,    // kg CO2 per kWh
        waste: 0.1      // kg CO2 per kg
    };
    
    return (factors[type] || 0.1) * amount;
}

// Update activities list
function updateActivitiesList() {
    const activitiesList = document.getElementById('activities-list');
    if (!activitiesList) return;

    activitiesList.innerHTML = '';

    if (activities.length === 0) {
        activitiesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No activities logged yet. Start tracking your carbon footprint!</p>';
        return;
    }

    activities.slice(0, 10).forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-log-item';
        activityElement.innerHTML = `
            <div class="activity-log-info">
                <h4>${activity.details}</h4>
                <p>${activity.type} • ${activity.date}</p>
            </div>
            <div class="activity-log-impact">
                <div class="impact-value">${activity.carbonImpact.toFixed(2)} kg CO2</div>
                <div class="impact-label">Carbon Impact</div>
            </div>
        `;
        activitiesList.appendChild(activityElement);
    });
}

// Update dashboard
function updateDashboard() {
    // Update current footprint
    const metricValue = document.querySelector('.metric-value');
    if (metricValue) {
        metricValue.textContent = userData.carbonFootprint.toFixed(1);
    }

    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progress = Math.min((userData.carbonFootprint / 4) * 100, 100);
        progressFill.style.width = `${progress}%`;
    }

    // Update metric description
    const metricDesc = document.querySelector('.metric-desc');
    if (metricDesc) {
        if (userData.carbonFootprint < 2.5) {
            metricDesc.textContent = 'Excellent! You\'re below average!';
        } else if (userData.carbonFootprint < 4) {
            metricDesc.textContent = 'Good! Keep working on reducing your footprint.';
        } else {
            metricDesc.textContent = 'Above average. Consider making some changes.';
        }
    }

    // Update recommendations
    updateRecommendations();
}

// Update recommendations
function updateRecommendations() {
    const recommendationList = document.querySelector('.recommendation-list');
    if (!recommendationList) return;

    const recommendations = [
        {
            icon: '🚌',
            title: 'Use Public Transport',
            description: `Save ${(userData.carbonFootprint * 0.3).toFixed(1)} kg CO2 per day`
        },
        {
            icon: '🥗',
            title: 'Meatless Monday',
            description: `Save ${(userData.carbonFootprint * 0.2).toFixed(1)} kg CO2 per day`
        },
        {
            icon: '💡',
            title: 'Energy Efficient',
            description: `Save ${(userData.carbonFootprint * 0.15).toFixed(1)} kg CO2 per day`
        }
    ];

    recommendationList.innerHTML = '';
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';
        recElement.innerHTML = `
            <span class="rec-icon">${rec.icon}</span>
            <div class="rec-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        `;
        recommendationList.appendChild(recElement);
    });
}

// Join challenge
function joinChallenge(challengeId) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
        challenge.joined = true;
        challenge.joinedAt = new Date().toISOString();
        challenge.progress = 0;
        showNotification(`Joined "${challenge.title}" challenge!`, 'success');
        updateChallengesUI();
        updateChallengeCards();
    }
}

// Back out from challenge
function backOutChallenge(challengeId) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
        // Show confirmation dialog
        if (confirm(`Are you sure you want to back out from "${challenge.title}"? You'll lose your progress.`)) {
            challenge.joined = false;
            challenge.joinedAt = null;
            challenge.progress = 0;
            showNotification(`Backed out from "${challenge.title}" challenge`, 'info');
            updateChallengesUI();
            updateChallengeCards();
        }
    }
}

// Update challenge progress
function updateChallengeProgress(challengeId, progress) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.joined) {
        challenge.progress = Math.min(100, Math.max(0, progress));
        
        if (challenge.progress >= 100) {
            showNotification(`🎉 Congratulations! You completed "${challenge.title}"!`, 'success');
            userData.points += parseInt(challenge.reward.match(/\d+/)[0]);
            saveUserData();
        }
        
        updateChallengeCards();
    }
}

// Update challenges UI
function updateChallengesUI() {
    const challengeButtons = document.querySelectorAll('.challenge-card .btn');
    challengeButtons.forEach((button, index) => {
        const challenge = challenges[index];
        if (challenge && challenge.joined) {
            button.textContent = 'Back Out';
            button.classList.remove('btn-outline');
            button.classList.add('btn-danger');
            button.onclick = () => backOutChallenge(challenge.id);
        } else {
            button.textContent = 'Join Challenge';
            button.classList.remove('btn-danger');
            button.classList.add('btn-outline');
            button.onclick = () => joinChallenge(challenge.id);
        }
    });
}

// Update challenge cards with progress
function updateChallengeCards() {
    const challengeCards = document.querySelectorAll('.challenge-card');
    challengeCards.forEach((card, index) => {
        const challenge = challenges[index];
        if (challenge) {
            // Update or add progress bar
            let progressBar = card.querySelector('.challenge-progress');
            if (!progressBar && challenge.joined) {
                progressBar = document.createElement('div');
                progressBar.className = 'challenge-progress';
                progressBar.innerHTML = `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${challenge.progress}%"></div>
                    </div>
                    <div class="progress-text">${challenge.progress}% Complete</div>
                `;
                
                // Insert before the button
                const button = card.querySelector('.btn');
                if (button) {
                    button.parentNode.insertBefore(progressBar, button);
                }
            } else if (progressBar) {
                if (challenge.joined) {
                    progressBar.style.display = 'block';
                    const progressFill = progressBar.querySelector('.progress-fill');
                    const progressText = progressBar.querySelector('.progress-text');
                    if (progressFill) progressFill.style.width = `${challenge.progress}%`;
                    if (progressText) progressText.textContent = `${challenge.progress}% Complete`;
                } else {
                    progressBar.style.display = 'none';
                }
            }
            
            // Update joined status indicator
            let statusIndicator = card.querySelector('.challenge-status');
            if (!statusIndicator) {
                statusIndicator = document.createElement('div');
                statusIndicator.className = 'challenge-status';
                card.querySelector('.challenge-header').appendChild(statusIndicator);
            }
            
            if (challenge.joined) {
                statusIndicator.innerHTML = '<span class="status-badge joined">Joined</span>';
                statusIndicator.style.display = 'block';
            } else {
                statusIndicator.style.display = 'none';
            }
        }
    });
}

// Like post
function likePost(postId) {
    showNotification('Post liked!', 'success');
    // In a real app, this would update the like count
}

// Comment post
function commentPost(postId) {
    showNotification('Comment feature coming soon!', 'info');
}

// Share post
function sharePost(postId) {
    showNotification('Share feature coming soon!', 'info');
}

// Draw weekly chart
function drawWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Sample data for the week
    const data = [2.1, 2.3, 2.0, 2.4, 2.2, 1.8, 2.1];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Find max value for scaling
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);

    // Set up chart
    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const barWidth = chartWidth / data.length;

    // Draw bars
    ctx.fillStyle = '#10b981';
    data.forEach((value, index) => {
        const barHeight = ((value - minValue) / (maxValue - minValue)) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        
        // Draw value
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value.toFixed(1), x + barWidth * 0.4, y - 5);
        ctx.fillText(days[index], x + barWidth * 0.4, height - 5);
        
        ctx.fillStyle = '#10b981';
    });
}

// Load sample data
function loadSampleData() {
    // Sample activities
    activities = [
        {
            id: 1,
            type: 'transport',
            details: 'Drove to work',
            amount: 15,
            carbonImpact: 3.0,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            date: new Date(Date.now() - 86400000).toLocaleDateString()
        },
        {
            id: 2,
            type: 'food',
            details: 'Ate beef for lunch',
            amount: 0.2,
            carbonImpact: 0.1,
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            date: new Date(Date.now() - 172800000).toLocaleDateString()
        }
    ];

    // Sample challenges
    challenges = [
        {
            id: 1,
            title: 'Public Transport Week',
            description: 'Use public transportation for an entire week',
            difficulty: 'easy',
            duration: '7 days',
            reward: '+200 points',
            joined: false,
            progress: 0,
            participants: 1250
        },
        {
            id: 2,
            title: 'Meatless Monday',
            description: 'Go vegetarian for one day',
            difficulty: 'easy',
            duration: '1 day',
            reward: '+50 points',
            joined: false,
            progress: 0,
            participants: 890
        },
        {
            id: 3,
            title: 'Energy Saver',
            description: 'Reduce home energy consumption by 20%',
            difficulty: 'hard',
            duration: '30 days',
            reward: '+500 points',
            joined: false,
            progress: 0,
            participants: 450
        }
    ];
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('carbonTrackerUserData');
    if (savedData) {
        try {
            userData = { ...userData, ...JSON.parse(savedData) };
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
}

// Save user data to localStorage
function saveUserData() {
    try {
        localStorage.setItem('carbonTrackerUserData', JSON.stringify(userData));
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

// Update user interface
function updateUserInterface() {
    // Update navigation to show user is logged in
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <span style="color: var(--text-secondary); margin-right: 1rem;">Welcome back!</span>
            <button class="btn btn-outline" onclick="logout()">Logout</button>
        `;
    }
}

// Logout
function logout() {
    userData = {
        carbonFootprint: 2.4,
        points: 1250,
        level: 5,
        activities: []
    };
    activities = [];
    saveUserData();
    
    // Reset navigation
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <button class="btn btn-outline" onclick="showLogin()">Login</button>
            <button class="btn btn-primary" onclick="showRegister()">Sign Up</button>
        `;
    }
    
    showNotification('Logged out successfully', 'success');
    updateDashboard();
    updateActivitiesList();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.showSection = showSection;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.closeModal = closeModal;
window.logActivity = logActivity;
window.joinChallenge = joinChallenge;
window.backOutChallenge = backOutChallenge;
window.updateChallengeProgress = updateChallengeProgress;
window.likePost = likePost;
window.commentPost = commentPost;
window.sharePost = sharePost;
window.toggleMenu = toggleMenu;
window.logout = logout;

// Test function to simulate challenge progress
window.testChallengeProgress = function(challengeId, progress) {
    updateChallengeProgress(challengeId, progress);
}; 