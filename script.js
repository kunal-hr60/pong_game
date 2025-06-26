const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 24;
const PLAYER_COLOR = '#42aaff';
const AI_COLOR = '#ea2e2e';
const BALL_COLOR = '#fff';
const NET_COLOR = '#fff';
const NET_WIDTH = 4;
const NET_SEGMENT = 24;
const NET_GAP = 18;
const FPS = 60;

// Game objects
let player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PLAYER_COLOR,
    dy: 0
};

let ai = {
    x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: AI_COLOR,
    dy: 0,
    speed: 4
};

let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speed: 6,
  dx: 6 * (Math.random() > 0.5 ? 1 : -1),
  dy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

let playerScore = 0;
let aiScore = 0;

// Draw net
function drawNet() {
    ctx.fillStyle = NET_COLOR;
    let y = 0;
    while (y < canvas.height) {
    ctx.fillRect(canvas.width / 2 - NET_WIDTH / 2, y, NET_WIDTH, NET_SEGMENT);
    y += NET_SEGMENT + NET_GAP;
    }
}

// Draw paddle
function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

// Draw scores
function drawScores() {
    ctx.font = '40px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore, canvas.width / 2 - 100, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 100, 50);
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

  // Wall collision (top/bottom)
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
    ball.dy = -ball.dy;
        }

  // Paddle collision (player)
    if (
        ball.x <= player.x + player.width &&
        ball.y + ball.size >= player.y &&
        ball.y <= player.y + player.height
    ) {
    ball.x = player.x + player.width; // Prevent sticking
    ball.dx = -ball.dx;
    // Add a bit of "spin" based on where the ball hits the paddle
    let collidePoint = ball.y + ball.size / 2 - (player.y + player.height / 2);
    ball.dy = collidePoint * 0.2;
    }

  // Paddle collision (AI)
    if (
    ball.x + ball.size >= ai.x &&
    ball.y + ball.size >= ai.y &&
    ball.y <= ai.y + ai.height
    ) {
    ball.x = ai.x - ball.size; // Prevent sticking
    ball.dx = -ball.dx;
    let collidePoint = ball.y + ball.size / 2 - (ai.y + ai.height / 2);
    ball.dy = collidePoint * 0.2;
    }

  // Score (AI)
    if (ball.x < 0) {
    aiScore++;
    resetBall();
    }
  // Score (Player)
    if (ball.x + ball.size > canvas.width) {
    playerScore++;
    resetBall();
    }
}

// Reset ball position and direction
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Move AI paddle (basic AI)
function moveAI() {
    let aiCenter = ai.y + ai.height / 2;
    let ballCenter = ball.y + ball.size / 2;
    if (ballCenter < aiCenter - 10) {
    ai.y -= ai.speed;
    } else if (ballCenter > aiCenter + 10) {
    ai.y += ai.speed;
    }
  // Clamp within canvas
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Handle mouse movement for player paddle
canvas.addEventListener('mousemove', function (evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
  // Clamp within canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// Main update
function update() {
    moveBall();
    moveAI();
}

// Main draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawScores();
    drawPaddle(player);
    drawPaddle(ai);
    drawBall();
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();