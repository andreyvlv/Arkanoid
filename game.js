let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width;
let height;

let dx = 2;
let dy = -2;

let gameEnabled = true;
let score = 0;
let won = false;

function resize() {
    width = 1270;
    height = 720;
    canvas.width = width;
    canvas.height = height;
}

window.onresize = resize;
resize();

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

ctx.fillStyle = 'red';

let state = {
    x: width / 2 - 50,
    y: 680,
    width: 100,
    height: 20,

    pressedKeys: {
        left: false,
        right: false
    }
}

let ball = {
    x: width / 2 - 50,
    y: 670,
    radius: 20
}


class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 20;
        this.enabled = true;
    }

    static InitWidth() {
        return 100;
    }

    static InitHeight() {
        return 20;
    }

    static Padding() {
        return 20;
    }

    static PaddingLeft() {
        return 50;
    }

    static PaddingTop() {
        return 20;
    }
}

let bricks = [];
for (let i = 0; i < 10; i++) {
    bricks[i] = [];
    for (let j = 0; j < 5; j++) {
        let brickX = i * (Brick.InitWidth() + Brick.Padding()) + Brick.PaddingLeft();
        let brickY = j * (Brick.InitHeight() + Brick.Padding()) + Brick.PaddingTop();
        bricks[i][j] = new Brick(brickX, brickY);
    }
}

function update(progress) {
    if (state.pressedKeys.left && state.x > 10) {
        state.x -= progress;
    }

    if (state.pressedKeys.right && state.x < width - (110)) {
        state.x += progress;
    }

    if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < 0) {
        dx = -dx;
    }

    if (ball.y + dy < 0) {
        dy = -dy;
    } else if (ball.y + dy > 670) {
        if (ball.x + ball.radius > state.x && ball.x < state.x + state.width) {            
            dy *= -1.05;
            dx *= 1.05;
            ball.x += getRandomIntInclusive(-5, 5); // random shift when collide with pad
        } else {
            gameEnabled = false;
        }
    }

    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            let b = bricks[i][j];
            if (b.enabled) {
                if (ball.x > b.x && ball.x < b.x + b.width && ball.y > b.y && ball.y < b.y + b.height) {
                    dy = -dy;
                    b.enabled = false;
                    score += 1;
                    
                    if(score === 50) {
                        gameEnabled = false;
                        won = true;
                    } 
                }
            }
        }
    }

    ball.x += dx;
    ball.y += dy;
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    drawPad();
    drawBall();
    drawBricks();
    drawScore();
}

function drawScore() {
    ctx.font = "14px Monospace";
    ctx.fillText("Score: " + score, 20, 710);
}

function drawPad() {
    ctx.fillRect(state.x, state.y, state.width, state.height);
}

function drawBall() {
    ctx.fillRect(ball.x, ball.y, ball.radius, ball.radius);
}

function drawBricks() {
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            let brick = bricks[i][j];
            if (brick.enabled) {
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        }
    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);

    // stop game
    if(!gameEnabled) {
        if(won) {
            alert("you won!");
            loop = null;
        } else {
            alert("you lose!");
            loop = null;
        }       
    }
}

let lastRender = 0;
window.requestAnimationFrame(loop);

let keyMap = {
    68: 'right',
    65: 'left'
}

function keydown(event) {
    var key = keyMap[event.keyCode];
    state.pressedKeys[key] = true;
}

function keyup(event) {
    var key = keyMap[event.keyCode];
    state.pressedKeys[key] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);