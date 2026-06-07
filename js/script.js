// Elements

const human = document.getElementById("human");
const robot = document.getElementById("robot");
const gameArea = document.getElementById("gameArea");
const gameOverBox = document.getElementById("gameOver");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");


// start game
startBtn.addEventListener("click", () => {

    startScreen.style.display = "none";

    gameRunning = true;

});
// Starting Positions

let humanX = 50;
let humanY = 50;

let robotX = 800;
let robotY = 450;

// Settings

const humanSpeed = 20;
const robotSpeed = 2;

let gameRunning = false;

// Initial Position

human.style.left = humanX + "px";
human.style.top = humanY + "px";

robot.style.left = robotX + "px";
robot.style.top = robotY + "px";

// Human Movement

document.addEventListener("keydown", (e) => {

    if (!gameRunning) return;

    switch (e.key) {

        case "ArrowLeft":
            humanX -= humanSpeed;
            break;

        case "ArrowRight":
            humanX += humanSpeed;
            break;

        case "ArrowUp":
            humanY -= humanSpeed;
            break;

        case "ArrowDown":
            humanY += humanSpeed;
            break;
    }

    human.style.left = humanX + "px";
    human.style.top = humanY + "px";

    checkBoundary();
});

// Human Boundary Check

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

// Robot AI

setInterval(() => {

    if (!gameRunning) return;

    let dx = humanX - robotX;
    let dy = humanY - robotY;

    // X Direction

    if (Math.abs(dx) > 3) {
        robotX += dx > 0 ? robotSpeed : -robotSpeed;
    }

    // Y Direction

    if (Math.abs(dy) > 3) {
        robotY += dy > 0 ? robotSpeed : -robotSpeed;
    }

    // Robot Boundary

    const maxX = gameArea.clientWidth - robot.offsetWidth;
    const maxY = gameArea.clientHeight - robot.offsetHeight;

    robotX = Math.max(0, Math.min(robotX, maxX));
    robotY = Math.max(0, Math.min(robotY, maxY));

    robot.style.left = robotX + "px";
    robot.style.top = robotY + "px";

    collisionCheck();

}, 20);

// Collision Detection

function collisionCheck() {

    const humanRect = human.getBoundingClientRect();
    const robotRect = robot.getBoundingClientRect();

    const isTouching =
        humanRect.left < robotRect.right &&
        humanRect.right > robotRect.left &&
        humanRect.top < robotRect.bottom &&
        humanRect.bottom > robotRect.top;

    if (isTouching) {
        endGame();
    }
}

// Game Over

function endGame() {

    gameRunning = false;

    gameOverBox.style.display = "block";
}