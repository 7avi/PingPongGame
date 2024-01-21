console.error("Scriptul pong.js a fost încărcat cu succes!");

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
let gameRunning = true;
let gameLost = false;

const paddle = {
    width: 10,
    height: 140,
    x: canvas.width - 40,
    y: canvas.height / 2 - 30,
    speed: 5
};

const ball = {
    size: 10,
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: 5,
    speedY: 5
};

let balls = [ball];
let score = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;

    paddle.x = canvas.width - 40;
}

window.addEventListener("load", function () {
    resizeCanvas();
    gameLoop();
});

window.addEventListener("resize", resizeCanvas);

function drawPaddle() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    for (let i = 0; i < balls.length; i++) {
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].size, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }
}

function drawBackground() {
    const backgroundImage = new Image();
    backgroundImage.src = 'bkb.png';

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    const marginSize = 10;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, marginSize);
    ctx.fillRect(0, canvas.height - marginSize, canvas.width, marginSize);
    ctx.fillRect(0, marginSize, marginSize, canvas.height - 2 * marginSize);
    ctx.fillRect(canvas.width - marginSize, marginSize, marginSize, canvas.height - 2 * marginSize);

    ctx.fillStyle = "#000000";
    ctx.font = "20px Bolt";
    ctx.fillText("<Created by `Tavi`>", 1340, 30);
    ctx.fillText("Scor: " + score, 45, 30);
}

function movePaddle() {
    paddle.y += paddle.speed;

    if (paddle.y < 0) {
        paddle.y = 0;
    }
    if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

function increaseScore() {
    score++;

    if (score === 5 || score === 10 || score === 15 || score === 20 || score === 25 || score === 30 || score === 35 || score === 45 || score === 60 || score === 80 || score === 85 || score === 90 || score === 100) {
        addExtraBall();
    }
}

function addExtraBall() {
    const newBall = {
        size: 10,
        x: canvas.width / 2,
        y: canvas.height / 2,
        speedX: 5,
        speedY: 5
    };

    balls.push(newBall);
}

function resetBall() {
    balls = [{
        size: 10,
        x: canvas.width / 2,
        y: canvas.height / 2,
        speedX: 5,
        speedY: 5
    }];

    score = 0;
    gameLost = false;
}

function moveBall() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].speedX;
        balls[i].y += balls[i].speedY;

        if (
            balls[i].x < paddle.x + paddle.width &&
            balls[i].x + balls[i].size > paddle.x &&
            balls[i].y > paddle.y &&
            balls[i].y < paddle.y + paddle.height
        ) {
            balls[i].speedX = -balls[i].speedX;
            increaseScore();
        }

        if (balls[i].x - balls[i].size < 0) {
            balls[i].speedX = -balls[i].speedX;
        }

        if (balls[i].y - balls[i].size < 0 || balls[i].y + balls[i].size > canvas.height) {
            balls[i].speedY = -balls[i].speedY;
        }

        if (balls[i].x + balls[i].size > canvas.width) {
            gameLost = true;
        }
    }
}

function showGameOverScreen() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FF0000";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = "24px Arial";
    ctx.fillText("Scor obținut: " + score, canvas.width / 2, canvas.height / 2);

    // Try Again functie
    const buttonX = canvas.width / 2 - 75;
    const buttonY = canvas.height / 2 + 50;
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonMargin = 5;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(buttonX - buttonMargin, buttonY - buttonMargin, buttonWidth + 2 * buttonMargin, buttonHeight + 2 * buttonMargin);

    ctx.fillStyle = "#FF0000";
    ctx.font = "24px Arial";
    ctx.fillText("Try Again", canvas.width / 2, canvas.height / 2 + 80);
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameLost) {
            showGameOverScreen();
        } else {
            drawBackground();
            drawPaddle();
            drawBall();
            movePaddle();
            moveBall();
        }

        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" && paddle.y > 0) {
        paddle.speed = -5;
    } else if (event.key === "ArrowDown" && paddle.y + paddle.height < canvas.height) {
        paddle.speed = 5;
    } else if (event.key === "f") {
        toggleFullscreen();
    }
});

document.addEventListener("keyup", function () {
    paddle.speed = 0;
});

// Asculta evenimentul de clic pentru buton
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Verifică dacă clicul s-a produs pe buton
    if (
        mouseX >= canvas.width / 2 - 75 &&
        mouseX <= canvas.width / 2 + 75 &&
        mouseY >= canvas.height / 2 + 50 &&
        mouseY <= canvas.height / 2 + 100
    ) {
        // Reporneste jocul
        gameLost = false;
        resetBall();
    }
});
