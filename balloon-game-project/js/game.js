// Balloon Pop Game - Main Game Logic
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
let musicEnabled = true;
let sfxEnabled = true;
let masterVolume = 0.5;
let isPaused = false;

// Shop and powerups
let coins = parseInt(localStorage.getItem('balloonCoins')) || 0;
let ownedItems = JSON.parse(localStorage.getItem('balloonOwnedItems')) || [];

const shopItems = {
    doublePoints: { price: 100, active: false },
    extraLife: { price: 150, active: false },
    slowMotion: { price: 200, active: false },
    goldenBalloon: { price: 250, active: false },
    magneticPower: { price: 180, active: false }
};

// Initialize owned items
ownedItems.forEach(itemId => {
    if (shopItems[itemId]) {
        shopItems[itemId].active = true;
    }
});

// Audio setup
let audioContext;
let bgMusicGain;
let isMusicPlaying = false;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Background music - simple melody
function startBackgroundMusic() {
    if (!musicEnabled) return;
    
    // Stop any existing music first
    stopBackgroundMusic();
    
    initAudio();
    isMusicPlaying = true;

    bgMusicGain = audioContext.createGain();
    bgMusicGain.connect(audioContext.destination);
    bgMusicGain.gain.value = masterVolume * 0.15;

    // Simple cheerful melody
    const melody = [
        {freq: 523.25, duration: 0.3}, // C5
        {freq: 587.33, duration: 0.3}, // D5
        {freq: 659.25, duration: 0.3}, // E5
        {freq: 698.46, duration: 0.3}, // F5
        {freq: 783.99, duration: 0.6}, // G5
        {freq: 698.46, duration: 0.3}, // F5
        {freq: 659.25, duration: 0.3}, // E5
        {freq: 587.33, duration: 0.6}, // D5
        {freq: 523.25, duration: 0.3}, // C5
        {freq: 587.33, duration: 0.3}, // D5
        {freq: 659.25, duration: 0.3}, // E5
        {freq: 523.25, duration: 0.9}, // C5
    ];

    let time = audioContext.currentTime;
    let timeoutId;
    
    function playMelody() {
        if (!isMusicPlaying || !musicEnabled) return;

        melody.forEach((note, i) => {
            const osc = audioContext.createOscillator();
            const noteGain = audioContext.createGain();
            
            osc.connect(noteGain);
            noteGain.connect(bgMusicGain);
            
            osc.frequency.value = note.freq;
            osc.type = 'sine';
            
            noteGain.gain.setValueAtTime(0, time);
            noteGain.gain.linearRampToValueAtTime(0.3, time + 0.05);
            noteGain.gain.linearRampToValueAtTime(0, time + note.duration);
            
            osc.start(time);
            osc.stop(time + note.duration);
            
            time += note.duration;
        });

        timeoutId = setTimeout(() => {
            time = audioContext.currentTime;
            playMelody();
        }, melody.reduce((sum, note) => sum + note.duration, 0) * 1000);
    }

    playMelody();
}

function stopBackgroundMusic() {
    isMusicPlaying = false;
    if (bgMusicGain && audioContext) {
        bgMusicGain.gain.setValueAtTime(bgMusicGain.gain.value, audioContext.currentTime);
        bgMusicGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    }
}

function updateMusicVolume() {
    if (bgMusicGain && audioContext) {
        bgMusicGain.gain.setValueAtTime(masterVolume * 0.15, audioContext.currentTime);
    }
}

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
let score = 0;
let lives = 3;
let balloons = [];
let gameRunning = false;
let lastTime = 0;
let spawnTimer = 0;
let spawnInterval = 1200;
let highScore = localStorage.getItem('balloonHighScore') || 0;

// Realistic balloon colors from the image
const balloonColors = [
    '#9B9FF5', '#FF7F6F', '#FFC75F', '#FFB4A3', '#B794F4', '#FF7FB8', '#C81E64',
    '#E8FF6F', '#FF6F42', '#7FEB7F', '#C77FEB', '#FF4285', '#FF70B8', '#6B7280',
    '#C85F72', '#5FEBB8', '#7F94FF', '#5FC4FF', '#FFCE94', '#FFB8E8', '#FFEB5F',
    '#B8B8FF', '#94C8FF', '#8F5FD4', '#5FE0EB', '#94EBB8', '#FF70D4', '#7FFF5F'
];

// Balloon image cache
const balloonImages = {};

// Create balloon images
function createBalloonImage(color) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 120;
    tempCanvas.height = 140;
    const tempCtx = tempCanvas.getContext('2d');

    // Balloon body
    tempCtx.fillStyle = color;
    tempCtx.beginPath();
    tempCtx.ellipse(60, 55, 45, 55, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Darker shading on bottom
    const gradient = tempCtx.createRadialGradient(60, 55, 0, 60, 55, 55);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    tempCtx.fillStyle = gradient;
    tempCtx.beginPath();
    tempCtx.ellipse(60, 55, 45, 55, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Highlight
    const highlightGradient = tempCtx.createRadialGradient(45, 35, 5, 50, 40, 25);
    highlightGradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
    tempCtx.fillStyle = highlightGradient;
    tempCtx.beginPath();
    tempCtx.ellipse(48, 38, 18, 22, -0.3, 0, Math.PI * 2);
    tempCtx.fill();

    // Knot at bottom
    tempCtx.fillStyle = color;
    tempCtx.filter = 'brightness(0.7)';
    tempCtx.beginPath();
    tempCtx.ellipse(60, 108, 6, 8, 0, 0, Math.PI * 2);
    tempCtx.fill();
    tempCtx.filter = 'none';

    // String
    tempCtx.strokeStyle = '#FFFFFF';
    tempCtx.lineWidth = 2;
    tempCtx.shadowColor = 'rgba(0,0,0,0.3)';
    tempCtx.shadowBlur = 2;
    tempCtx.beginPath();
    tempCtx.moveTo(60, 110);
    tempCtx.quadraticCurveTo(65, 120, 60, 135);
    tempCtx.stroke();
    tempCtx.shadowBlur = 0;

    return tempCanvas;
}

// Preload balloon images
balloonColors.forEach(color => {
    balloonImages[color] = createBalloonImage(color);
});
balloonImages['#FFD700'] = createBalloonImage('#FFD700'); // Golden balloon

// Balloon class
class Balloon {
    constructor() {
        this.radius = 28 + Math.random() * 18;
        this.x = this.radius + Math.random() * (canvas.width - this.radius * 2);
        this.y = canvas.height + this.radius;
        
        // Check for golden balloon
        this.isGolden = shopItems.goldenBalloon.active && Math.random() < 0.1;
        
        let baseSpeed = 1.2 + Math.random() * 1.8;
        if (shopItems.slowMotion.active) {
            baseSpeed *= 0.7; // 30% slower
        }
        this.speed = baseSpeed;
        
        this.color = this.isGolden ? '#FFD700' : balloonColors[Math.floor(Math.random() * balloonColors.length)];
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.015 + Math.random() * 0.025;
        this.rotation = (Math.random() - 0.5) * 0.3;
        this.popped = false;
        this.scale = 1;
    }

    update(deltaTime) {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.8;

        if (this.y + this.radius < 0 && !this.popped) {
            this.popped = true;
            lives--;
            updateUI();
            if (lives <= 0) {
                endGame();
            }
            return true;
        }
        return false;
    }

    draw() {
        if (this.popped) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation + Math.sin(this.wobble) * 0.1);
        ctx.scale(this.scale, this.scale);

        const img = balloonImages[this.color];
        const size = this.radius * 2.2;
        ctx.drawImage(img, -size/2, -size/2, size, size * 1.15);

        // Draw sparkles for golden balloon
        if (this.isGolden) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 3; i++) {
                const angle = (Date.now() / 500 + i * Math.PI * 2 / 3) % (Math.PI * 2);
                const sparkleX = Math.cos(angle) * this.radius * 0.8;
                const sparkleY = Math.sin(angle) * this.radius * 0.8;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    isClicked(x, y) {
        const dist = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        const clickRadius = shopItems.magneticPower.active ? this.radius * 1.5 : this.radius;
        return dist < clickRadius;
    }

    pop() {
        this.popped = true;
        
        let points = this.isGolden ? 50 : 10;
        if (shopItems.doublePoints.active && !this.isGolden) {
            points *= 2;
        }
        
        score += points;
        coins += Math.floor(points / 10); // 1 coin per 10 points
        
        updateUI();
        createPopEffect(this.x, this.y, this.color);
        playPopSound();
    }
}

// Pop effect particles
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.color = color;
        this.size = 4 + Math.random() * 6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3;
        this.vx *= 0.98;
        this.life -= 0.018;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

let particles = [];

function createPopEffect(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Simple pop sound using Web Audio API
function playPopSound() {
    if (!sfxEnabled) return;
    
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3 * masterVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    
    // Save coins
    localStorage.setItem('balloonCoins', coins);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('balloonHighScore', highScore);
    }
    document.getElementById('highScore').textContent = highScore;
    
    const gameOverEl = document.getElementById('gameOver');
    gameOverEl.style.display = 'block';
    setTimeout(() => {
        gameOverEl.classList.add('show');
    }, 10);
    
    // Add confetti effect
    createConfetti();
}

function createConfetti() {
    const gameOverEl = document.getElementById('gameOver');
    const colors = ['#FFD93D', '#FF6B9D', '#667eea', '#FA742B', '#7FEB7F', '#5FC4FF'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        gameOverEl.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function resetGame() {
    score = 0;
    lives = shopItems.extraLife.active ? 4 : 3;
    balloons = [];
    particles = [];
    gameRunning = true;
    spawnTimer = 0;
    spawnInterval = 1200;
    updateUI();
    const gameOverEl = document.getElementById('gameOver');
    gameOverEl.classList.remove('show');
    gameOverEl.style.display = 'none';
    lastTime = performance.now();
    gameLoop(lastTime);
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    bgAnimationRunning = false;
    startBackgroundMusic();
    resetGame();
}

// Input handling
function handleClick(e) {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    for (let i = balloons.length - 1; i >= 0; i--) {
        if (balloons[i].isClicked(x, y) && !balloons[i].popped) {
            balloons[i].pop();
            break;
        }
    }
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleClick(e);
});

// Draw clouds
let cloudOffset = 0;
function drawClouds() {
    cloudOffset += 0.15;
    
    const cloudData = [
        { y: 60, scale: 1.2, speed: 1 },
        { y: 150, scale: 0.9, speed: 0.7 },
        { y: 240, scale: 1.1, speed: 0.85 },
        { y: 330, scale: 0.95, speed: 0.6 }
    ];
    
    cloudData.forEach((cloud, i) => {
        const x = (cloudOffset * cloud.speed + i * 400) % (canvas.width + 300) - 150;
        const y = cloud.y;
        const scale = cloud.scale;
        
        // Shadow
        ctx.fillStyle = 'rgba(150, 180, 210, 0.15)';
        ctx.beginPath();
        ctx.arc(x + 5, y + 8, 28 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale + 5, y + 8, 38 * scale, 0, Math.PI * 2);
        ctx.arc(x + 80 * scale + 5, y + 8, 32 * scale, 0, Math.PI * 2);
        ctx.arc(x + 120 * scale + 5, y + 8, 28 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Main cloud body - white with gradient
        const gradient = ctx.createRadialGradient(x + 60 * scale, y - 10, 10, x + 60 * scale, y, 60 * scale);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(x, y, 28 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y - 8, 38 * scale, 0, Math.PI * 2);
        ctx.arc(x + 80 * scale, y - 5, 32 * scale, 0, Math.PI * 2);
        ctx.arc(x + 120 * scale, y, 28 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight on top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(x + 45 * scale, y - 15, 22 * scale, 0, Math.PI * 2);
        ctx.arc(x + 75 * scale, y - 18, 18 * scale, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Game loop
function gameLoop(currentTime) {
    if (!gameRunning) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClouds();

    spawnTimer += deltaTime;
    if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        balloons.push(new Balloon());
        
        if (spawnInterval > 600) {
            spawnInterval -= 15;
        }
    }

    for (let i = balloons.length - 1; i >= 0; i--) {
        if (balloons[i].update(deltaTime)) {
            balloons.splice(i, 1);
        } else {
            balloons[i].draw();
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].draw();
        }
    }

    requestAnimationFrame(gameLoop);
}

updateUI();
