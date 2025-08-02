# Carbon Footprint Tracker 🌱

A comprehensive carbon footprint tracking application with both simplified and full-stack versions.

## 🚀 **Quick Start - Simplified Version**

**No installation required!** Just open `index.html` in your web browser to start using the application immediately.

### Features Available:
- ✅ **Dashboard** - View your carbon footprint and progress
- ✅ **Activity Tracking** - Log daily activities and see their carbon impact
- ✅ **Challenges** - Join eco-friendly challenges with back out functionality
- ✅ **Community** - Connect with like-minded individuals
- ✅ **Responsive Design** - Works perfectly on all devices

## 📁 **Current Project Structure**

```
byt_burst/
├── index.html          # Main application (simplified version)
├── styles.css          # All styling and responsive design
├── script.js           # Interactive functionality
├── README.md           # This file
├── package.json        # Project configuration
├── frontend/           # React version (requires Node.js)
│   ├── package.json    # React dependencies
│   ├── tsconfig.json   # TypeScript configuration
│   └── src/            # React source files
├── backend/            # Node.js backend (optional)
├── database/           # Database setup (optional)
└── ml-service/         # Python ML service (optional)
```

## 🎯 **Two Ways to Use the App**

### **Option 1: Simplified Version (Recommended)**
```bash
# Just open index.html in your browser
# No installation required!
```

**Perfect for:**
- Quick demo
- No Node.js installation
- Immediate use
- All core features

### **Option 2: Full React Version**
```bash
cd frontend
npm install
npm start
```

**Requires:**
- Node.js installed
- npm package manager
- Internet connection for dependencies

## 🌟 **Key Features**

### **Simplified Version Features:**
- 📊 **Dashboard** - Real-time carbon footprint display
- 📝 **Activity Logging** - Track daily activities
- 🎯 **Challenges** - Join and back out from challenges
- 🤝 **Community** - Social features and posts
- 📱 **Responsive** - Works on mobile and desktop
- 🎨 **Modern UI** - Beautiful, clean design

### **Full React Version Features:**
- 🔐 **Authentication** - User registration and login
- ⚙️ **Settings** - Auto/manual mode preferences
- 🔄 **Real-time Sync** - Background data synchronization
- 📊 **Advanced Analytics** - Detailed charts and insights
- 🎯 **Advanced Challenges** - Progress tracking and rewards
- 🔔 **Notifications** - Real-time updates

## 🎮 **Challenge Features**

### **Join Challenges:**
1. Go to "Challenges" section
2. Click "Join Challenge" on any challenge
3. See progress bar and status updates

### **Back Out from Challenges:**
1. Click "Back Out" button on joined challenges
2. Confirm in the dialog that appears
3. Challenge resets to "Join Challenge" state

### **Test Progress:**
Open browser console and run:
```javascript
// Test 50% progress on challenge 1
testChallengeProgress(1, 50);

// Complete challenge 1
testChallengeProgress(1, 100);
```

## 🔧 **Technical Details**

### **Simplified Version:**
- **Pure HTML/CSS/JavaScript** - No frameworks
- **Local Storage** - Saves data locally
- **Progressive Enhancement** - Works without JavaScript
- **Cross-browser Compatible** - All modern browsers

### **Full React Version:**
- **React 18** - Latest React features
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Styled Components** - CSS-in-JS styling

## 📊 **Carbon Calculation**

The app uses simplified carbon factors:
- **Transportation**: 0.2 kg CO2 per km
- **Food**: 0.5 kg CO2 per kg
- **Energy**: 0.8 kg CO2 per kWh
- **Waste**: 0.1 kg CO2 per kg

## 🚀 **Getting Started**

### **For Immediate Use:**
1. Download the project files
2. Open `index.html` in your web browser
3. Start tracking your carbon footprint!

### **For Development:**
1. Install Node.js from https://nodejs.org/
2. Navigate to the frontend folder
3. Run `npm install` to install dependencies
4. Run `npm start` to start the development server

## 🔮 **Future Enhancements**

- User accounts and authentication
- Database integration
- Advanced analytics
- Social sharing
- Mobile app version
- Real-time data sync

## 📞 **Support**

This is a demonstration application. For questions or suggestions, please refer to the code comments or create an issue in the repository.

---

**Make a difference today! 🌍 Start tracking your carbon footprint and join the community of eco-conscious individuals.** 