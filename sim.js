'use strict';
var simSpace;
var ctx;
var gamePad;
var vertexMode = false;
var getContext = function() {
	simSpace = document.getElementById("simSpace");
	ctx = simSpace.getContext("2d");
	window.addEventListener("gamepadconnected", function(e) {
		  var gp = navigator.getGamepads()[e.gamepad.index];
		  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
		    gp.index, gp.id,
		    gp.buttons.length, gp.axes.length);
		});
	update();
};

var drawVertex = function(wheel) {
	ctx.beginPath();
	ctx.moveTo(wheel.getWheelX(), wheel.getWheelY());
	ctx.lineTo(wheel.getWheelX() + wheel.vertexX, wheel.getWheelY() + wheel.vertexY);
	ctx.stroke();
};

var robot = {
	X:150,
	Y:150,
	rotation: 0,
    vertexes: {
        forward:0,
        strafe:0,
        rotation:0
    },
	leftTopWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
			return robot.X + 15*Math.cos(robot.rotation) - 15*Math.sin(robot.rotation);
		},
		getWheelY: function() {
  			return robot.Y - 15*Math.cos(robot.rotation) - 15*Math.sin(robot.rotation);
		}},
	rightTopWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
			return robot.X - 15*Math.cos(robot.rotation) - 15*Math.sin(robot.rotation);
		},
		getWheelY: function() {
			return robot.Y - 15*Math.cos(robot.rotation) + 15*Math.sin(robot.rotation);
		}},
	rightBottomWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
			return robot.X - 15*Math.cos(robot.rotation) + 15*Math.sin(robot.rotation);
		},
		getWheelY: function() {
			return robot.Y + 15*Math.cos(robot.rotation) + 15*Math.sin(robot.rotation);
		}},	
	leftBottomWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
			return robot.X + 15*Math.cos(robot.rotation) + 15*Math.sin(robot.rotation);
		},
		getWheelY: function() {
			return robot.Y + 15*Math.cos(robot.rotation) - 15*Math.sin(robot.rotation);
		}},
	drawWheels: function() {
		ctx.beginPath();
		ctx.moveTo(robot.leftTopWheel.getWheelX(), robot.leftTopWheel.getWheelY());
		ctx.lineTo(robot.rightTopWheel.getWheelX(), robot.rightTopWheel.getWheelY());
		ctx.lineTo(robot.rightBottomWheel.getWheelX(), robot.rightBottomWheel.getWheelY());
		ctx.lineTo(robot.leftBottomWheel.getWheelX(), robot.leftBottomWheel.getWheelY());
		ctx.lineTo(robot.leftTopWheel.getWheelX(), robot.leftTopWheel.getWheelY());
		ctx.stroke();
		
		drawVertex(robot.leftTopWheel);
		drawVertex(robot.rightTopWheel);
		drawVertex(robot.rightBottomWheel);
		drawVertex(robot.leftBottomWheel);
	},
    updateWheelVertexes: function() {
        var A = Math.min(robot.vertexes.strafe - robot.vertexes.rotation*15, 15);
        var B = Math.min(robot.vertexes.strafe + robot.vertexes.rotation*15, 15);
        var C = Math.min(-robot.vertexes.forward - robot.vertexes.rotation*15, 15);
        var D = Math.min(-robot.vertexes.forward + robot.vertexes.rotation*15, 15);
        
        A = Math.max(A, -15);
        B = Math.max(B, -15);
        C = Math.max(C, -15);
        D = Math.max(D, -15);
        
        robot.leftTopWheel.vertexX = B;
        robot.leftTopWheel.vertexY = D;
        
        robot.rightTopWheel.vertexX = B;
        robot.rightTopWheel.vertexY = C;
        
        robot.rightBottomWheel.vertexX = A;
        robot.rightBottomWheel.vertexY = C;
        
        robot.leftBottomWheel.vertexX = A;
        robot.leftBottomWheel.vertexY = D;
    },
    cleanValues: function() {
        robot.rotation %= 2*Math.PI;
        if(robot.X < 0){
            robot.X = 299;
        } else if (robot.Y < 0) {
            robot.Y = 299;
        } else {
            robot.X %= 300;
            robot.Y %= 300;
        }
        
        robot.vertexes.forward = Math.min(robot.vertexes.forward, 15);
        robot.vertexes.strafe = Math.min(robot.vertexes.strafe, 15);
        robot.vertexes.forward = Math.max(robot.vertexes.forward, -15);
        robot.vertexes.strafe = Math.max(robot.vertexes.strafe, -15);
        robot.vertexes.rotation = Math.min(robot.vertexes.rotation, Math.PI);
        robot.vertexes.rotation = Math.max(robot.vertexes.rotation, -Math.PI);
    }
    
};

document.onkeydown = function(e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
        case 39:
            robot.X += 5;
            break;
        case 40:
            robot.Y += 5;
            break;
        case 37:
            robot.X -= 5;
            break;
        case 38:
            robot.Y -= 5;
            break;
        case 88:
            robot.rotation -= Math.PI/8;
            break;
        case 90:
            robot.rotation += Math.PI/8;
            break;
        case 87:
            robot.vertexes.forward += 5;
            robot.updateWheelVertexes();
            break;
        case 83:
            robot.vertexes.forward -= 5;
            robot.updateWheelVertexes();
            break;
        case 65:
            robot.vertexes.strafe -= 5;
            robot.updateWheelVertexes();
            break;
        case 68:
            robot.vertexes.strafe += 5;
            robot.updateWheelVertexes();
            break;
        case 69:
            robot.vertexes.rotation += Math.PI/8;
            robot.updateWheelVertexes();
            break;
        case 81:
            robot.vertexes.rotation -= Math.PI/8;
            robot.updateWheelVertexes();
            break;
    }
    robot.cleanValues();
};

var update = function() {
	if(navigator.getGamepads()[0]) {
		gamePad = navigator.getGamepads()[0];
		if (vertexMode) {
			console.log(vertexMode);
			if(Math.abs(gamePad.axes[0]) > 0.1) {
	        	robot.vertexes.strafe = 15*gamePad.axes[0];
	        } else {
	        	robot.vertexes.strafe = 0;
	        }
	        if(Math.abs(gamePad.axes[1]) > 0.1) {
	        	robot.vertexes.forward = -(15*gamePad.axes[1]);
	        } else {
	        	robot.vertexes.forward = 0;
	        }
	        if(Math.abs(gamePad.axes[2]) > 0.1) {
	        	robot.vertexes.rotation = gamePad.axes[2] * Math.PI;
	        } else {
	        	robot.vertexes.rotation = 0;
	        }
	        robot.updateWheelVertexes();
		} else {
	        if(Math.abs(gamePad.axes[0]) > 0.1) {
	        	robot.X += 5*gamePad.axes[0];
	        }
	        if(Math.abs(gamePad.axes[1]) > 0.1) {
	        	robot.Y += 5*gamePad.axes[1];
	        }
	        if(Math.abs(gamePad.axes[2]) > 0.1) {
	        	robot.rotation -= gamePad.axes[2] * Math.PI/8;
	        }
		}
		if(gamePad.buttons[10].pressed) {
        	vertexMode = !vertexMode;
        	console.log("toggled");
        }
		if(gamePad.buttons[8].pressed) {
        	robot.rotation = 0;
        	robot.X = 150;
        	robot.Y = 150;
        	robot.vertexes.forward = 0;
        	robot.vertexes.strafe = 0;
        	robot.vertexes.rotation = 0;
        	robot.updateWheelVertexes();
        }
        robot.cleanValues();
    }
    ctx.clearRect(0,0,300,300);
    robot.drawWheels();
	requestAnimationFrame(update);
};
