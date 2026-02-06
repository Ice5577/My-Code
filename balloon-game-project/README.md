# 🎈 Balloon Pop - Hyper Casual Game

A fun and addictive hyper-casual game where you pop balloons before they float away! Built with HTML5 Canvas and vanilla JavaScript.

## 🎮 Game Features

### Core Gameplay
- **Simple Controls**: Click or tap balloons to pop them
- **Lives System**: Start with 3 lives (or 4 with Extra Life powerup)
- **Progressive Difficulty**: Game gets faster as you play
- **High Score Tracking**: Beat your personal best!

### Visual & Audio
- **28 Colorful Balloons**: Beautiful, realistic balloon designs
- **Smooth Animations**: Wobble effects, particle explosions, and floating clouds
- **Background Music**: Cheerful melody that loops continuously
- **Sound Effects**: Satisfying pop sounds
- **Animated Main Menu**: Balloons floating in the background

### Game Modes & Features
- **Pause System**: Pause anytime with ESC key or pause button
- **Settings**: Control music, sound effects, and volume
- **Coin System**: Earn coins based on your score (1 coin per 10 points)
- **Shop System**: Purchase powerful upgrades

## 🛒 Shop Items

| Item | Cost | Description |
|------|------|-------------|
| ✨ Double Points | 100 🪙 | Get 2x points per balloon |
| ❤️ Extra Life | 150 🪙 | Start with 4 lives instead of 3 |
| ⏱️ Slow Motion | 200 🪙 | Balloons rise 30% slower |
| 🌟 Golden Balloon | 250 🪙 | Rare golden balloons worth 50 points |
| 🧲 Magnetic Power | 180 🪙 | Larger click radius for easier popping |

## 📁 Project Structure

```
balloon-game-project/
├── index.html          # Main HTML file
├── assets/             # Game assets
│   ├── balloon_1.png   # Balloon sprites (1-28)
│   ├── balloon_2.png
│   └── ...
├── css/
│   └── style.css       # All game styles
└── js/
    ├── game.js         # Core game logic
    └── ui.js           # UI controls and menus
```

## 🚀 How to Run

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser
3. **Start playing!** No build process or dependencies needed

### For Development
Simply open the files in your favorite code editor and refresh the browser to see changes.

## 💻 Technical Details

### Technologies Used
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** (no frameworks)
- **CSS3** for UI styling
- **Web Audio API** for music and sound effects
- **LocalStorage** for saving progress

### Browser Compatibility
Works on all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Controls
- **Desktop**: Mouse click
- **Mobile**: Touch/Tap
- **Keyboard**: ESC to pause/resume

## 🎨 Assets

All balloon assets are procedurally generated PNG files with:
- Realistic shading and highlights
- Transparent backgrounds
- Consistent 120x140px size
- 28 different colors plus 1 golden balloon

## 📊 Game Mechanics

### Scoring
- Regular balloon: **10 points**
- With Double Points: **20 points**
- Golden balloon: **50 points**

### Coin Earning
- Earn **1 coin** for every **10 points** scored
- Coins persist between games
- Use coins to purchase permanent upgrades

### Difficulty Progression
- Balloons spawn every 1.2 seconds initially
- Spawn rate increases as you play
- Minimum spawn rate: 0.6 seconds

## 🎓 Educational Value

This project demonstrates:
- Canvas API manipulation
- Game loop implementation
- Object-oriented programming in JavaScript
- LocalStorage for data persistence
- Responsive design for mobile and desktop
- Audio synthesis with Web Audio API
- Particle systems for visual effects

## 📝 License

This project is created for educational purposes. Feel free to use and modify for your own learning!

## 👨‍💻 Author

Created as a school project to demonstrate game development skills with vanilla JavaScript.

## 🙏 Acknowledgments

- Balloon color palette inspired by realistic balloon designs
- Font: Fredoka (Google Fonts)
- Game design influenced by popular hyper-casual mobile games

---

**Enjoy playing and happy coding! 🎈**
