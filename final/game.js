$(document).ready(function() {
    var canvas = document.getElementById("myCanvas")
    var ctx = canvas.getContext("2d");
    var ballRadius = 15;
    var paddleHeight = 15;
    var paddleWidth = 112.5;
    var x = paddleX + (paddleWidth / 2);
    var y = canvas.height - paddleHeight - ballRadius;
    var dx = currentlevel;
    var dy = -currentlevel;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 112.5;
    var brickHeight = 30;
    var brickPadding = 15;
    var brickOffsetTop = 45;
    var currentlevel = 2;
    var brickOffsetLeft = 45;
    var bricks = []; //the array that save the position of the brick
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    var score = 0;

    function drawballbeforestart() {
        ctx.beginPath();
        y = canvas.height - paddleHeight - ballRadius;
        x = paddleX + (paddleWidth / 2);
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawball() {
        //draw the ball on the canvas
        // $('myCanvas').getContext.beginPath();
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawbeforestart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawballbeforestart();
        drawPaddle();
        collisionDetection();
        drawScore();
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 3;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 3;
        }
    }

    function draw() {
        // draw the ball and erase the previous one
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawball();
        drawPaddle();
        collisionDetection();
        drawScore();
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y > canvas.height - paddleHeight - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                //the ball is inside the paddle
                dy = -dy;
            } else {
                alert("GAME OVER");
                location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            }
        }
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 5;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 5;
        }
        x += dx;
        y += dy;
    }
    $(document).keydown(function(event) {
        if (event.key == "Right" || event.key == "ArrowRight") {
            rightPressed = true;
        } else if (event.key == "Left" || event.key == "ArrowLeft") {
            leftPressed = true;
        }
    });
    $(document).keyup(function(event) {
        if (event.key == "Right" || event.key == "ArrowRight") {
            rightPressed = false;
        } else if (event.key == "Left" || event.key == "ArrowLeft") {
            leftPressed = false;
        }
    });

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x + dx >= b.x - ballRadius && x + dx <= b.x + brickWidth + ballRadius && y + dy >= b.y - ballRadius && y + dy <= b.y + brickHeight + ballRadius) {
                        dy = -dy;
                        b.status = 0; // calculations
                        score++;
                        if (score == brickColumnCount * brickRowCount) {
                            clearInterval(interval);
                            $(".container").show();
                            $("#nextlevelmodal").attr('class', 'modal show')
                            $("#No").on('click', function() {
                                $("#nextlevelmodal").attr('class', 'modal')
                                location.reload(true);
                            })
                            $("#nextlevel").on('click', function() {
                                for (var c = 0; c < brickColumnCount; c++) {
                                    for (var r = 0; r < brickRowCount; r++) {
                                        var b = bricks[c][r];
                                        b.status = 1;
                                    }
                                }
                                $("#nextlevelmodal").attr('class', 'modal')
                                currentlevel += 2;
                                if (paddleWidth > 80) {
                                    paddleWidth -= 5;
                                }
                                $("#nextlevelmodal").attr('class', 'modal')
                                $(".container").hide();
                                clearInterval(interval);
                                interval = setInterval(drawbeforestart, 10);
                            })
                        }
                    }
                }
            }

        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
    }

    $("#start").on('click', function() {
        $("#startmodal").attr('class', 'modal')
        $(".container").hide();
        interval = setInterval(drawbeforestart, 10);
    })
    $(document).keydown(function(event) {
        if (event.key == " " || event.key == "Spacebar") {
            clearInterval(interval)
            y = canvas.height - paddleHeight - ballRadius
            dx = currentlevel;
            dy = -currentlevel;
            interval = setInterval(draw, 10);
        }
    });
})