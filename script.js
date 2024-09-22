const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

document.addEventListener('keydown', () => {
    if (!gameOver) {
        bird.velocity += bird.lift;
    } else {
        resetGame();
    }
});

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
}

function createPipe() {
    const gap = 80;
    const pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - gap,
    });
}

function update() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    if (frame % 90 === 0) {
        createPipe();
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;

        if (pipe.x + 20 < bird.x && !pipe.passed) {
            score++;
            pipe.passed = true;
        }

        // Collision detection
        if (
            bird.x < pipe.x + 20 &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }

        if (pipe.x + 20 < 0) {
            pipes.splice(index, 1);
        }
    });

    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, 20, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 20, pipe.bottom);
    });

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    if (gameOver) {
        ctx.fillText('Game Over! Press any key to restart.', 20, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
