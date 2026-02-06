# 🚀 Setup Instructions for Balloon Pop Game

## Quick Start

### Option 1: Direct Browser (Easiest)
1. Extract the `balloon-game-project.zip` file
2. Navigate to the extracted folder
3. Double-click `index.html`
4. The game will open in your default browser
5. Start playing! 🎮

### Option 2: Local Web Server (Recommended for GitHub Pages)
```bash
# Using Python 3
cd balloon-game-project
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```
Then open `http://localhost:8000` in your browser.

## 📤 Uploading to GitHub

### Step 1: Create a GitHub Repository
1. Go to https://github.com
2. Click **"New Repository"**
3. Name it: `balloon-pop-game`
4. **DO NOT** initialize with README (we have one already)
5. Click **"Create repository"**

### Step 2: Upload Files

#### Method A: Using GitHub Web Interface (Easiest)
1. Click **"uploading an existing file"**
2. Drag and drop all files from `balloon-game-project` folder
3. Write commit message: "Initial commit - Balloon Pop Game"
4. Click **"Commit changes"**

#### Method B: Using Git Command Line
```bash
cd balloon-game-project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Balloon Pop Game"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/balloon-pop-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository **Settings**
2. Click **"Pages"** in the left sidebar
3. Under **"Source"**, select **"main"** branch
4. Click **"Save"**
5. Your game will be live at: `https://YOUR_USERNAME.github.io/balloon-pop-game/`

## 📁 Project Structure Explanation

```
balloon-game-project/
├── index.html              # Main game page
├── README.md              # Project documentation
├── SETUP.md              # This file
├── .gitignore            # Git ignore rules
│
├── assets/               # Game assets (PNG images)
│   ├── balloon_1.png     # 28 different balloon colors
│   ├── balloon_2.png     
│   ├── ...
│   └── balloon_golden.png # Special golden balloon
│
├── css/
│   └── style.css         # All game styling
│
└── js/
    ├── game.js           # Main game logic
    └── ui.js             # Menu and UI controls
```

## 🎓 Presenting to Your Teacher

### What to Show:
1. **Live Demo**: Play the game to show features
2. **Code Structure**: Explain how code is organized
3. **GitHub Repository**: Show version control usage
4. **Asset Management**: Explain the PNG assets

### Key Points to Mention:
- ✅ Built with vanilla JavaScript (no frameworks)
- ✅ HTML5 Canvas for rendering
- ✅ Responsive design (works on mobile & desktop)
- ✅ LocalStorage for save data
- ✅ Modular code structure (separated JS files)
- ✅ Asset-based design (PNG images)
- ✅ Version controlled with Git

## 🔧 Customization

### Change Balloon Colors:
Edit the `balloonColors` array in `js/game.js`

### Modify Game Difficulty:
In `js/game.js`, adjust:
- `spawnInterval` - Time between balloons
- `baseSpeed` - How fast balloons rise
- Initial `lives` count

### Add New Shop Items:
1. Add item to `shopItems` object in `js/game.js`
2. Add HTML in `index.html` shop section
3. Implement the powerup logic in the `Balloon` class

## 💡 Tips for Grading

- Show understanding of **game loop** concept
- Explain **object-oriented programming** (Balloon class)
- Demonstrate **event handling** (click, keyboard)
- Discuss **data persistence** (LocalStorage)
- Highlight **responsive design** practices

## 🐛 Troubleshooting

**Problem**: Balloons not showing
- **Solution**: Make sure all PNG files are in `assets/` folder

**Problem**: Music not playing
- **Solution**: Some browsers block autoplay. Click to start music.

**Problem**: Game not working on GitHub Pages
- **Solution**: Make sure all paths are relative (no absolute paths)

## 📧 Support

If you have any issues, check:
1. Browser console for errors (F12)
2. All files are properly uploaded
3. File paths are correct (case-sensitive!)

---

**Good luck with your presentation! 🎈🎉**
