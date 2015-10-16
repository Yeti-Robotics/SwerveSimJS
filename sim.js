'use strict';
var simSpace;
var ctx;
var gamePad;
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

var update = function() {
	if(navigator.getGamepads()[0]) {
		var gp = navigator.getGamepads()[0];
	}
	requestAnimationFrame(update);
};

var drawVertex = function(wheel) {
	ctx.beginPath();
	ctx.moveTo(wheel.getWheelX(), wheel.getWheelY());
	ctx.lineTo(wheel.getWheelX() + wheel.vertexX, wheel.getWheelY() - wheel.vertexY);
	ctx.stroke();
};

var robot = {
	X:150,
	Y:150,
	rotation: 0,
	leftTopWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
//			return robot.X + 10*Math.sin(45 - robot.rotation);
			return robot.X - 30/Math.SQRT2;
		},
		getWheelY: function() {
//			return robot.Y - 10*Math.cos(45 - robot.rotation);
			return robot.Y - 30/Math.SQRT2;
		}},
	rightTopWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
//			return robot.X - 10*Math.sin(45 + robot.rotation);
			return robot.X + 30/Math.SQRT2;
		},
		getWheelY: function() {
//			return robot.Y - 10*Math.cos(45 + robot.rotation);
			return robot.Y - 30/Math.SQRT2;
		}},
	rightBottomWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
//			return robot.X - 10*Math.sin(45 - robot.rotation);
			return robot.X + 30/Math.SQRT2;
		},
		getWheelY: function() {
//			return robot.Y + 10*Math.cos(45 - robot.rotation);
			return robot.Y + 30/Math.SQRT2;
		}},	
	leftBottomWheel: {
		vertexX:0,
		vertexY:0,
		getWheelX: function() {
//			return robot.X + 10*Math.sin(45 + robot.rotation);
			return robot.X - 30/Math.SQRT2;
		},
		getWheelY: function() {
//			return robot.Y + 10*Math.cos(45 + robot.rotation);
			return robot.Y + 30/Math.SQRT2;
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
	}
};