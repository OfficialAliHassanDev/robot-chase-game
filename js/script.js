// ======================================
// ELEMENTS
// ======================================

const human = document.getElementById("human");
const robot = document.getElementById("robot");
const gameArea = document.getElementById("gameArea");
const gameOverBox = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");

const coin = document.getElementById("coin");

const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");

const levelPopup = document.getElementById("levelPopup");

// ======================================
// SOUNDS
// ======================================

const coinSound = new Audio("sounds/mario-coin.mp3");
const levelSound = new Audio("sounds/levelup.mp3");
const deathSound = new Audio("sounds/mario-death.mp3");

// ======================================
// GAME DATA
// ======================================

let score = 0;
let level = 1;

let gameRunning = false;

// ======================================
// POSITIONS
// ======================================

let humanX = 50;
let humanY = 50;

let robotX = 800;
let robotY = 450;

// ======================================
// SETTINGS
// ======================================

const humanSpeed = 20;
let robotSpeed = 1.5;

// ======================================
// INITIAL POSITION
// ======================================

human.style.left = humanX + "px";
human.style.top = humanY + "px";

robot.style.left = robotX + "px";
robot.style.top = robotY + "px";

// ======================================
// START GAME
// ======================================

startBtn.addEventListener("click", () => {

    startScreen.style.display = "none";

    gameRunning = true;

    spawnCoin();
});

// ======================================
// HUMAN MOVEMENT FUNCTION
// ======================================

function moveHuman(direction) {

    switch (direction) {

        case "left":
            humanX -= humanSpeed;
            break;

        case "right":
            humanX += humanSpeed;
            break;

        case "up":
            humanY -= humanSpeed;
            break;

        case "down":
            humanY += humanSpeed;
            break;
    }

    human.style.left = humanX + "px";
    human.style.top = humanY + "px";

    collectCoin();

    checkBoundary();
}

// ======================================
// KEYBOARD CONTROLS
// ======================================

document.addEventListener("keydown", (e) => {

    if (!gameRunning) return;

    switch (e.key) {

        case "ArrowLeft":
            moveHuman("left");
            break;

        case "ArrowRight":
            moveHuman("right");
            break;

        case "ArrowUp":
            moveHuman("up");
            break;

        case "ArrowDown":
            moveHuman("down");
            break;
    }

});

// ======================================
// MOBILE SWIPE CONTROLS
// ======================================

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

});


document.addEventListener("touchend", (e) => {

    if (!gameRunning) return;

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    // Swipe sensitivity
    const swipeMultiplier = 1;

    if (Math.abs(dx) > Math.abs(dy)) {

        if (Math.abs(dx) > 20) {

            humanX += dx * swipeMultiplier;

        }

    } else {

        if (Math.abs(dy) > 20) {

            humanY += dy * swipeMultiplier;

        }

    }

    human.style.left = humanX + "px";
    human.style.top = humanY + "px";

    collectCoin();
    checkBoundary();

});
// ======================================
// COIN SPAWN SYSTEM
// ======================================

function spawnCoin() {

    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 50;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    coin.style.left = randomX + "px";
    coin.style.top = randomY + "px";
}

// ======================================
// COIN COLLECTION
// ======================================

function collectCoin() {

    const humanRect = human.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    const touchCoin =

        humanRect.left < coinRect.right &&
        humanRect.right > coinRect.left &&
        humanRect.top < coinRect.bottom &&
        humanRect.bottom > coinRect.top;

    if (touchCoin) {

        // Mario Coin Sound

        coinSound.pause();
        coinSound.currentTime = 0;
        coinSound.play();

        // Score

        score += 10;

        scoreText.innerText = "💖 Score: " + score;

        // Score Animation

        scoreText.classList.add("score-pop");

        setTimeout(() => {

            scoreText.classList.remove("score-pop");

        }, 250);

        // Coin Animation

        coin.classList.add("coin-animation");

        setTimeout(() => {

            coin.classList.remove("coin-animation");

        }, 250);

        // New Coin

        spawnCoin();

        // Check Level

        checkLevel();

if(score >= 300){
    showWinScreen();
}
    }
}

// ======================================
// LEVEL SYSTEM
// ======================================

function checkLevel() {

    // LEVEL 2

    if (score >= 50 && level === 1) {

        level = 2;

        robotSpeed = 2;

        levelText.innerText = "🔥 Level: 2";

        showLevelPopup(level);
    }

    // LEVEL 3

    if (score >= 100 && level === 2) {

        level = 3;

        robotSpeed = 3;

        levelText.innerText = "🔥 Level: 3";

        showLevelPopup(level);
    }

    // LEVEL 4

    if (score >= 200 && level === 3) {

        level = 4;

        robotSpeed = 4;

        levelText.innerText = "🔥 Level: 4";

        showLevelPopup(level);
    }

    // LEVEL 5

    if (score >= 350 && level === 4) {

        level = 5;

        robotSpeed = 5;

        levelText.innerText = "🔥 Level: 5";

        showLevelPopup(level);
    }
}

// ======================================
// LEVEL UP POPUP
// ======================================

function showLevelPopup(levelNumber) {

    levelSound.pause();

    levelSound.currentTime = 0;

    levelSound.play();

    levelPopup.innerHTML =
        `🔥 LEVEL ${levelNumber} UNLOCKED 🔥`;

    levelPopup.style.display = "block";

    setTimeout(() => {

        levelPopup.style.display = "none";

    }, 2500);
}
// ======================================
// HUMAN BOUNDARY CHECK
// ======================================

function checkBoundary() {

    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const humanWidth = human.offsetWidth;
    const humanHeight = human.offsetHeight;

    if (
        humanX <= 0 ||
        humanY <= 0 ||
        humanX + humanWidth >= areaWidth ||
        humanY + humanHeight >= areaHeight
    ) {

        endGame();
    }
}

// ======================================
// ROBOT AI CHASE SYSTEM
// ======================================

setInterval(() => {

    if (!gameRunning) return;

    let dx = humanX - robotX;
    let dy = humanY - robotY;

    // Move Robot X

    if (Math.abs(dx) > 2) {

        robotX += dx > 0
            ? robotSpeed
            : -robotSpeed;
    }

    // Move Robot Y

    if (Math.abs(dy) > 2) {

        robotY += dy > 0
            ? robotSpeed
            : -robotSpeed;
    }

    // Robot Boundary

    const maxX =
        gameArea.clientWidth -
        robot.offsetWidth;

    const maxY =
        gameArea.clientHeight -
        robot.offsetHeight;

    robotX = Math.max(
        0,
        Math.min(robotX, maxX)
    );

    robotY = Math.max(
        0,
        Math.min(robotY, maxY)
    );

    robot.style.left = robotX + "px";
    robot.style.top = robotY + "px";

    collisionCheck();

}, 20);

// ======================================
// COLLISION DETECTION
// ======================================

function collisionCheck() {

    const humanRect =
        human.getBoundingClientRect();

    const robotRect =
        robot.getBoundingClientRect();

    const touch =

        humanRect.left < robotRect.right &&
        humanRect.right > robotRect.left &&
        humanRect.top < robotRect.bottom &&
        humanRect.bottom > robotRect.top;

    if (touch) {

        endGame();
    }
}

// ======================================
// GAME OVER FUNCTION
// ======================================

function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    // Mario Death Sound

    deathSound.pause();

    deathSound.currentTime = 0;

    deathSound.play();

    // Human Fade Effect

    human.style.opacity = "0.4";

    // Screen Shake

    gameArea.classList.add("shake");

    setTimeout(() => {

        gameArea.classList.remove("shake");

    }, 500);

    // Game Over Popup

    gameOverBox.innerHTML = `
    
        <h2>💀 GAME OVER</h2>

        <p>
            💖 Score: ${score}
        </p>

        <p>
            🔥 Level: ${level}
        </p>

        <button onclick="location.reload()">
            Play Again
        </button>

    `;

    gameOverBox.style.display = "block";
}
// ======================================
// GAME WIN FUNCTION
// ======================================
function showWinScreen(){

    gameRunning = false;

    gameOverBox.innerHTML = `
        <h2>🏆 YOU WIN!</h2>
        <p>Final Score: ${score}</p>
        <button onclick="location.reload()">
            Play Again
        </button>
    `;

    gameOverBox.style.display = "block";
}