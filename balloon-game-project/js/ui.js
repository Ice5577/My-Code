// Balloon Pop Game - UI Controls and Menus

// Background canvas for menu
const bgCanvas = document.getElementById('backgroundGame');
const bgCtx = bgCanvas.getContext('2d');
let bgBalloons = [];
let bgAnimationRunning = true;

function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}

function createBackgroundBalloon() {
    const balloon = {
        radius: 25 + Math.random() * 20,
        x: Math.random() * bgCanvas.width,
        y: bgCanvas.height + 50,
        speed: 0.5 + Math.random() * 1,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.015,
        rotation: (Math.random() - 0.5) * 0.3,
        opacity: 0.6 + Math.random() * 0.4
    };
    return balloon;
}

function animateBackground() {
    if (!bgAnimationRunning) return;

    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw sky gradient
    const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw simple clouds
    bgCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 3; i++) {
        const x = (Date.now() * 0.01 + i * 300) % (bgCanvas.width + 200) - 100;
        const y = 60 + i * 100;
        bgCtx.beginPath();
        bgCtx.arc(x, y, 25, 0, Math.PI * 2);
        bgCtx.arc(x + 35, y, 35, 0, Math.PI * 2);
        bgCtx.arc(x + 70, y, 25, 0, Math.PI * 2);
        bgCtx.fill();
    }

    // Spawn new balloons
    if (Math.random() < 0.02 && bgBalloons.length < 15) {
        bgBalloons.push(createBackgroundBalloon());
    }

    // Update and draw balloons
    for (let i = bgBalloons.length - 1; i >= 0; i--) {
        const b = bgBalloons[i];
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * 0.5;

        if (b.y + b.radius < 0) {
            bgBalloons.splice(i, 1);
            continue;
        }

        bgCtx.save();
        bgCtx.globalAlpha = b.opacity;
        bgCtx.translate(b.x, b.y);
        bgCtx.rotate(b.rotation + Math.sin(b.wobble) * 0.1);

        const img = balloonImages[b.color];
        const size = b.radius * 2.2;
        bgCtx.drawImage(img, -size/2, -size/2, size, size * 1.15);

        bgCtx.restore();
    }

    requestAnimationFrame(animateBackground);
}

resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas);
animateBackground();

// Event Listeners
document.getElementById('restartBtn').addEventListener('click', resetGame);
document.getElementById('startBtn').addEventListener('click', startGame);

// Pause functionality
document.getElementById('pauseBtn').addEventListener('click', () => {
    if (gameRunning) {
        isPaused = true;
        gameRunning = false;
        document.getElementById('pauseScreen').classList.add('show');
    }
});

document.getElementById('resumeBtn').addEventListener('click', () => {
    isPaused = false;
    gameRunning = true;
    document.getElementById('pauseScreen').classList.remove('show');
    lastTime = performance.now();
    gameLoop(lastTime);
});

document.getElementById('quitBtn').addEventListener('click', () => {
    isPaused = false;
    gameRunning = false;
    document.getElementById('pauseScreen').classList.remove('show');
    document.getElementById('startScreen').style.display = 'flex';
    bgAnimationRunning = true;
    animateBackground();
    stopBackgroundMusic();
    balloons = [];
    particles = [];
});

// Settings functionality
document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('show');
});

document.getElementById('closeSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.remove('show');
});

// Music toggle
document.getElementById('musicToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    musicEnabled = this.classList.contains('active');
    if (musicEnabled && gameRunning) {
        startBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
});

// SFX toggle
document.getElementById('sfxToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    sfxEnabled = this.classList.contains('active');
});

// Volume slider
document.getElementById('volumeSlider').addEventListener('input', function() {
    masterVolume = this.value / 100;
    document.getElementById('volumeValue').textContent = this.value + '%';
    updateMusicVolume();
});

// Keyboard shortcut for pause
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && gameRunning && !isPaused) {
        document.getElementById('pauseBtn').click();
    } else if (e.code === 'Escape' && isPaused) {
        document.getElementById('resumeBtn').click();
    }
});

// Menu buttons
document.getElementById('menuOptionsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('show');
});

document.getElementById('menuSettings').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('show');
});

document.getElementById('menuAchievements').addEventListener('click', () => {
    // Placeholder for achievements - could be expanded later
    alert('🏆 Achievements Coming Soon!\n\nStay tuned for exciting challenges and rewards!');
});

// Shop functionality
function updateShopUI() {
    document.getElementById('coinAmount').textContent = coins;
    
    document.querySelectorAll('.shop-item').forEach(itemEl => {
        const itemId = itemEl.dataset.item;
        const btn = itemEl.querySelector('.shop-buy-btn');
        const ownedLabel = itemEl.querySelector('.shop-item-owned');
        const price = parseInt(btn.dataset.price);
        
        if (shopItems[itemId].active) {
            btn.textContent = '✓ Owned';
            btn.classList.add('owned');
            btn.disabled = true;
            ownedLabel.style.display = 'block';
        } else if (coins < price) {
            btn.classList.add('cannot-afford');
        } else {
            btn.classList.remove('cannot-afford');
        }
    });
}

document.getElementById('shopBtn').addEventListener('click', () => {
    updateShopUI();
    document.getElementById('shopModal').classList.add('show');
});

document.getElementById('closeShop').addEventListener('click', () => {
    document.getElementById('shopModal').classList.remove('show');
});

// Shop item purchase
document.querySelectorAll('.shop-buy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const itemEl = this.closest('.shop-item');
        const itemId = itemEl.dataset.item;
        const price = parseInt(this.dataset.price);
        
        if (shopItems[itemId].active) return; // Already owned
        
        if (coins >= price) {
            coins -= price;
            shopItems[itemId].active = true;
            ownedItems.push(itemId);
            
            // Save to localStorage
            localStorage.setItem('balloonCoins', coins);
            localStorage.setItem('balloonOwnedItems', JSON.stringify(ownedItems));
            
            updateShopUI();
            
            // Visual feedback
            this.textContent = '✓ Purchased!';
            setTimeout(() => {
                updateShopUI();
            }, 500);
        }
    });
});
