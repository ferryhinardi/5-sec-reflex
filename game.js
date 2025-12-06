// ======================
// GAME CONFIGURATION
// ======================
const CONFIG = {
    canvas: {
        width: 800,
        height: 500,
        backgroundColor: '#0F0F1E'
    },
    bar: {
        width: 8,
        height: 80,
        color: '#FFFFFF',
        initialSpeed: 3,
        speedIncrement: 0.3,
        maxSpeed: 15
    },
    targetZone: {
        width: 120,
        perfectWidth: 30,
        color: '#00D9A3',
        perfectColor: '#00FF9F',
        opacity: 0.3
    },
    scoring: {
        perfect: 100,
        great: 60,
        good: 30,
        comboMultiplier: 0.2
    },
    timing: {
        perfectThreshold: 15,
        greatThreshold: 40,
        goodThreshold: 60
    }
};

// ======================
// GAME STATE
// ======================
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.round = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.perfects = 0;
        this.isPlaying = false;
        this.isRoundActive = false;
        this.highScore = this.loadHighScore();
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('reflexHighScore') || '0');
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('reflexHighScore', this.score.toString());
            return true;
        }
        return false;
    }

    addScore(rating, distance) {
        let baseScore = 0;
        
        switch(rating) {
            case 'perfect':
                baseScore = CONFIG.scoring.perfect;
                this.perfects++;
                this.combo++;
                break;
            case 'great':
                baseScore = CONFIG.scoring.great;
                this.combo++;
                break;
            case 'good':
                baseScore = CONFIG.scoring.good;
                this.combo++;
                break;
            default:
                this.combo = 0;
                return 0;
        }

        const comboBonus = Math.floor(baseScore * this.combo * CONFIG.scoring.comboMultiplier);
        const totalScore = baseScore + comboBonus;
        
        this.score += totalScore;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        
        return totalScore;
    }

    nextRound() {
        this.round++;
        this.isRoundActive = false;
    }
}

// ======================
// BAR ENTITY
// ======================
class Bar {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = this.canvas.height / 2 - CONFIG.bar.height / 2;
        this.width = CONFIG.bar.width;
        this.height = CONFIG.bar.height;
        this.speed = CONFIG.bar.initialSpeed;
        this.direction = 1;
        this.pattern = 'linear';
        this.time = 0;
    }

    setDifficulty(round) {
        // Increase speed
        this.speed = Math.min(
            CONFIG.bar.initialSpeed + (round - 1) * CONFIG.bar.speedIncrement,
            CONFIG.bar.maxSpeed
        );

        // Randomize starting position every few rounds
        if (round > 3 && Math.random() > 0.5) {
            this.x = Math.random() > 0.5 ? 0 : this.canvas.width - this.width;
            this.direction = this.x === 0 ? 1 : -1;
        } else {
            this.x = 0;
            this.direction = 1;
        }

        // Randomize movement pattern
        if (round > 5) {
            const patterns = ['linear', 'ease', 'wave'];
            this.pattern = patterns[Math.floor(Math.random() * patterns.length)];
        } else {
            this.pattern = 'linear';
        }

        this.time = 0;
    }

    update() {
        this.time += 0.016; // Approximate frame time

        let movement = this.speed * this.direction;

        // Apply movement pattern
        switch(this.pattern) {
            case 'ease':
                const progress = this.direction === 1 
                    ? this.x / this.canvas.width 
                    : 1 - this.x / this.canvas.width;
                const easedSpeed = this.speed * (1 + Math.sin(progress * Math.PI) * 0.5);
                movement = easedSpeed * this.direction;
                break;
            case 'wave':
                const wave = Math.sin(this.time * 3) * 2;
                movement = (this.speed + wave) * this.direction;
                break;
        }

        this.x += movement;

        // Bounce at edges
        if (this.x <= 0) {
            this.x = 0;
            this.direction = 1;
        } else if (this.x >= this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
            this.direction = -1;
        }
    }

    draw(ctx) {
        // Draw shadow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(this.x + 2, this.y + 2, this.width, this.height);
        
        // Draw bar
        ctx.fillStyle = CONFIG.bar.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw glow
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, 
            this.y + this.height / 2, 
            0,
            this.x + this.width / 2, 
            this.y + this.height / 2, 
            this.height
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(
            this.x - this.height / 2, 
            this.y - this.height / 2, 
            this.width + this.height, 
            this.height * 2
        );
    }

    getCenterX() {
        return this.x + this.width / 2;
    }
}

// ======================
// TARGET ZONE
// ======================
class TargetZone {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2 - CONFIG.targetZone.width / 2;
        this.y = 0;
        this.width = CONFIG.targetZone.width;
        this.height = canvas.height;
        this.perfectX = this.x + this.width / 2 - CONFIG.targetZone.perfectWidth / 2;
        this.perfectWidth = CONFIG.targetZone.perfectWidth;
    }

    draw(ctx) {
        // Draw good zone
        ctx.fillStyle = CONFIG.targetZone.color + '40';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw great zone
        ctx.fillStyle = CONFIG.targetZone.color + '60';
        ctx.fillRect(
            this.x + (this.width - CONFIG.timing.greatThreshold) / 2,
            this.y,
            CONFIG.timing.greatThreshold,
            this.height
        );

        // Draw perfect zone
        ctx.fillStyle = CONFIG.targetZone.perfectColor;
        ctx.fillRect(this.perfectX, this.y, this.perfectWidth, this.height);

        // Draw borders
        ctx.strokeStyle = CONFIG.targetZone.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = CONFIG.targetZone.perfectColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.perfectX, this.y, this.perfectWidth, this.height);
    }

    checkHit(barCenterX) {
        const zoneCenterX = this.x + this.width / 2;
        const distance = Math.abs(barCenterX - zoneCenterX);

        if (distance <= CONFIG.timing.perfectThreshold) {
            return { rating: 'perfect', distance };
        } else if (distance <= CONFIG.timing.greatThreshold) {
            return { rating: 'great', distance };
        } else if (distance <= CONFIG.timing.goodThreshold) {
            return { rating: 'good', distance };
        }
        
        return { rating: 'miss', distance };
    }
}

// ======================
// GAME RENDERER
// ======================
class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    clear() {
        this.ctx.fillStyle = CONFIG.canvas.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
    }

    drawRatingText(rating, x, y) {
        const colors = {
            perfect: '#00FF9F',
            great: '#6C5CE7',
            good: '#FFD93D'
        };

        const sizes = {
            perfect: 60,
            great: 50,
            good: 40
        };

        this.ctx.font = `900 ${sizes[rating]}px 'Segoe UI'`;
        this.ctx.fillStyle = colors[rating];
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Text shadow
        this.ctx.shadowColor = colors[rating];
        this.ctx.shadowBlur = 20;
        
        this.ctx.fillText(rating.toUpperCase(), x, y);
        
        this.ctx.shadowBlur = 0;
    }
}

// ======================
// GAME CONTROLLER
// ======================
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        
        this.state = new GameState();
        this.bar = new Bar(this.canvas);
        this.targetZone = new TargetZone(this.canvas);
        this.renderer = new Renderer(this.canvas, this.ctx);
        
        this.animationId = null;
        this.ratingFeedback = null;
        this.ratingTimer = 0;
        
        this.setupEventListeners();
        this.updateUI();
    }

    setupCanvas() {
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('game-screen');
            this.startGame();
        });

        // Retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.showScreen('game-screen');
            this.startGame();
        });

        // Menu button
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.showScreen('start-screen');
            this.updateUI();
        });

        // Game input
        this.canvas.addEventListener('click', () => this.handleInput());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }

    startGame() {
        this.state.reset();
        this.bar.reset();
        this.updateUI();
        this.startRound();
    }

    startRound() {
        document.getElementById('ready-prompt').classList.remove('hidden');
        this.state.isRoundActive = false;
        this.ratingFeedback = null;
    }

    handleInput() {
        if (!this.state.isPlaying) return;

        if (!this.state.isRoundActive) {
            // Start the round
            this.state.isRoundActive = true;
            document.getElementById('ready-prompt').classList.add('hidden');
            this.bar.setDifficulty(this.state.round);
            
            if (!this.animationId) {
                this.gameLoop();
            }
        } else {
            // Stop and check hit
            this.checkHit();
        }
    }

    checkHit() {
        const result = this.targetZone.checkHit(this.bar.getCenterX());
        
        if (result.rating === 'miss') {
            this.gameOver();
        } else {
            const scoreGained = this.state.addScore(result.rating, result.distance);
            this.showFeedback(result.rating, scoreGained);
            this.state.nextRound();
            this.updateUI();
            
            // Show streak notification
            if (this.state.combo > 0 && this.state.combo % 5 === 0) {
                this.showStreakNotification();
            }
            
            setTimeout(() => this.startRound(), 1000);
        }
    }

    showFeedback(rating, score) {
        const overlay = document.getElementById('feedback-overlay');
        overlay.className = 'feedback-overlay';
        overlay.classList.add(rating);
        
        this.ratingFeedback = { rating, timer: 60 };
        
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.className = 'feedback-overlay hidden';
        }, 500);

        // Play sound effect (visual representation)
        this.playSound(rating);
    }

    showStreakNotification() {
        const notification = document.getElementById('streak-notification');
        notification.textContent = `${this.state.combo}x STREAK!`;
        notification.classList.remove('hidden');
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hidden');
        }, 1000);
    }

    playSound(rating) {
        // Audio context for beep sounds
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch(e) {
                return;
            }
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const frequencies = {
            perfect: 880,
            great: 660,
            good: 440,
            miss: 200
        };

        oscillator.frequency.value = frequencies[rating];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    gameOver() {
        this.state.isPlaying = false;
        this.state.isRoundActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        const isNewRecord = this.state.saveHighScore();
        
        // Show game over screen
        document.getElementById('final-score').textContent = this.state.score;
        document.getElementById('final-round').textContent = this.state.round;
        document.getElementById('final-combo').textContent = this.state.maxCombo + 'x';
        document.getElementById('final-perfects').textContent = this.state.perfects;
        
        const newRecordEl = document.getElementById('new-record');
        if (isNewRecord && this.state.score > 0) {
            newRecordEl.classList.remove('hidden');
        } else {
            newRecordEl.classList.add('hidden');
        }

        this.showFeedback('miss', 0);
        
        setTimeout(() => {
            this.showScreen('game-over-screen');
        }, 800);
    }

    updateUI() {
        // Update HUD
        document.getElementById('score-display').textContent = this.state.score;
        document.getElementById('round-display').textContent = this.state.round;
        document.getElementById('combo-display').textContent = this.state.combo + 'x';
        document.getElementById('game-high-score').textContent = this.state.highScore;
        
        // Update start screen
        document.getElementById('high-score-display').textContent = this.state.highScore;
    }

    gameLoop() {
        if (!this.state.isPlaying || !this.state.isRoundActive) {
            this.animationId = null;
            return;
        }

        this.bar.update();
        this.render();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    render() {
        this.renderer.clear();
        this.renderer.drawGrid();
        this.targetZone.draw(this.ctx);
        this.bar.draw(this.ctx);

        // Draw rating feedback
        if (this.ratingFeedback && this.ratingFeedback.timer > 0) {
            this.renderer.drawRatingText(
                this.ratingFeedback.rating,
                this.canvas.width / 2,
                100
            );
            this.ratingFeedback.timer--;
        }
    }
}

// ======================
// INITIALIZE GAME
// ======================
let game;

window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
