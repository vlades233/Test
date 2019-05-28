var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 8;
var ballSpeedY = 8;

var player1Score = 0;
var player2Score = 0;
const winningScore = 3;
var winScreen = false;

var paddleRightY = 250;
var paddleLeftY = 250;
var paddleHeight = 100;
var paddleWidth = 10;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			drawEverything();
		}, 1000/framesPerSecond);


        setInterval(function(){
        var mousePos = calculateMousePos();
		paddleLeftY = mousePos.y - (paddleHeight/2);
		console.log(paddleLeftY);
//		setInterval(function() {console.log(mousePos)},1000); -->
	    },33);

    canvas.addEventListener('mousedown',
        function(evt){
            if(winScreen){
               winScreen = false;
               player1Score = 0;
               player2Score = 0;
            }
        });
}

// left paddle mouse event
function calculateMousePos(){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
	var mouse = createVector(markerRoot1.position.x, markerRoot1.position.y, markerRoot1.position.z, camera, 800, 600);
//	console.log(mouse.y); -->
    var mouseY = mouse.y - rect.top - root.scrollTop;
    return {
        y:mouseY
    };
}

//right paddle (computer)
function computerMovement(){
    var centrePaddleRight = paddleRightY + (paddleHeight/2);
    if (centrePaddleRight < ballY - 35){
        paddleRightY += 7;
    } else if (centrePaddleRight > ballY + 35){
        paddleRightY -= 7;
    }
}

// Reset ball and change direction
function ballReset(){
    if (player1Score > winningScore || player2Score > winningScore){
        winScreen = true;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX =- ballSpeedX;
}

function moveEverything() {
    if(winScreen){
        return;
    }
    computerMovement();

	ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width){
        if( ballY > paddleRightY &&
            ballY < paddleRightY + paddleHeight ){
                 ballSpeedX =- ballSpeedX;
                // vary angle of ball when edge of paddle
                 deltaY = ballY - (paddleRightY + paddleHeight/2);
                 ballSpeedY = deltaY * 0.25;
            } else {
                player1Score ++;
                ballReset();
            }
    }
    if (ballX < 0){
        if( ballY > paddleLeftY &&
            ballY < paddleLeftY + paddleHeight ){
                 ballSpeedX =- ballSpeedX;

                 // vary angle of ball when edge of paddle
                 deltaY = ballY - (paddleLeftY + paddleHeight/2);
                 ballSpeedY = deltaY * 0.25;
            } else {
                player2Score ++;
                ballReset();
            }
    }
    if (ballY > canvas.height){
        ballSpeedY =- ballSpeedY;
    }
    if (ballY < 0){
        ballSpeedY =- ballSpeedY;
    }
}

// Canvas rectangles
function colourRect(leftX, topY, width, height, bColour){
    canvasContext.fillStyle = bColour;
	canvasContext.fillRect(leftX, topY, width, height);
}

// canvas circle
function colourCircle(centerX, centerY, rad, bColour){
    canvasContext.fillStyle = bColour;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, rad, 0, 2*Math.PI, true);
    canvasContext.fill();
}

// canvas net
function gamenet(){
    for(var i=0; i<canvas.height; i+=20){
        colourRect(canvas.width/2-1, i, 2, 10, 'white');
    }
}

// Canvas parameters
function drawEverything() {

    if(winScreen){
        colourRect(0, 0, canvas.width, canvas.height, 'black');
        canvasContext.font="30px Arial";
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("Click to Start Game", 260, canvas.height/2);

        if (player1Score > winningScore){
            canvasContext.fillText("Left Player Won", 280, 100);
        } else if (player2Score > winningScore){
            canvasContext.fillText("Right Player Won", 280, 100);
        }

        return;
    }

	colourRect(0, 0, canvas.width, canvas.height, 'black');
    // net
    gamenet();
    // left paddle
    colourRect(0,paddleLeftY, paddleWidth, paddleHeight, 'white');
    // right paddle
    colourRect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight, 'white');
    // ball
    colourCircle(ballX, ballY, 10, 'red');

    //scores
    canvasContext.font="30px Arial";
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-120, 100)
}

function createVector(x, y, z, camera, width, height) {
        var p = new THREE.Vector3(x, y, z);
        var vector = p.project(camera);

        vector.y = -(vector.y - 1) / 2 * height;

        return vector;
}
