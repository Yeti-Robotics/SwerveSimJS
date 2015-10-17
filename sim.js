'use strict';
var simSpace;
var ctx;
var statCanvas;
var statCtx;
var gamePad;
var vertexMode = false;
var getContext = function () {
    simSpace = document.getElementById("simSpace");
    ctx = simSpace.getContext("2d");
    statCanvas = document.getElementById("statOutput");
    statCtx = statCanvas.getContext("2d");
    drawStatBox();
    update();
};

var drawVertex = function (wheel) {
    ctx.beginPath();
    ctx.moveTo(wheel.getWheelX(), wheel.getWheelY());
    ctx.lineTo(wheel.getWheelX() + wheel.vertexX, wheel.getWheelY() + wheel.vertexY);
    ctx.stroke();
};

var drawStatBox = function () {
    statCtx.beginPath();
    statCtx.rect(25, 1, 50, 200);
    statCtx.rect(150, 1, 50, 200);
    statCtx.rect(275, 1, 50, 200);
    statCtx.rect(400, 1, 50, 200);

    statCtx.moveTo(100, 250);
    statCtx.arc(50, 250, 49, 0, 2 * Math.PI);
    statCtx.moveTo(225, 250);
    statCtx.arc(175, 250, 49, 0, 2 * Math.PI);
    statCtx.moveTo(350, 250);
    statCtx.arc(300, 250, 49, 0, 2 * Math.PI);
    statCtx.moveTo(475, 250);
    statCtx.arc(425, 250, 49, 0, 2 * Math.PI);
    statCtx.stroke();
};

var getWheelStats = function (wheel) {
    var rotation = Math.atan(wheel.vertexX / wheel.vertexY);
    return {
        rotation: Math.atan(wheel.vertexX / wheel.vertexY),
        statX: 50 * Math.sin(rotation),
        statY: 50 * Math.cos(rotation),
        power: Math.sqrt(Math.pow(wheel.vertexX, 2) + Math.pow(wheel.vertexY, 2))
    };
};

var updateWheelStats = function () {
    statCtx.clearRect(0, 0, 475, 300);
    drawStatBox();
    statCtx.beginPath();
    statCtx.strokeStyle = "red";
    statCtx.fillRect(25, 200, 50, -getWheelStats(robot.leftTopWheel).power / 21 * 200);
    statCtx.fillRect(150, 200, 50, -getWheelStats(robot.rightTopWheel).power / 21 * 200);
    statCtx.fillRect(275, 200, 50, -getWheelStats(robot.rightBottomWheel).power / 21 * 200);
    statCtx.fillRect(400, 200, 50, -getWheelStats(robot.leftBottomWheel).power / 21 * 200);

    statCtx.moveTo(50, 250);
    statCtx.lineTo(50 - getWheelStats(robot.leftTopWheel).statX, 250 - getWheelStats(robot.leftTopWheel).statY);
    statCtx.moveTo(175, 250);
    statCtx.lineTo(175 - getWheelStats(robot.rightTopWheel).statX, 250 - getWheelStats(robot.rightTopWheel).statY);
    statCtx.moveTo(300, 250);
    statCtx.lineTo(300 - getWheelStats(robot.rightBottomWheel).statX, 250 - getWheelStats(robot.rightBottomWheel).statY);
    statCtx.moveTo(425, 250);
    statCtx.lineTo(425 - getWheelStats(robot.leftBottomWheel).statX, 250 - getWheelStats(robot.leftBottomWheel).statY);
    statCtx.stroke();
    statCtx.strokeStyle = "black";
};

var robot = {
    X: 150,
    Y: 150,
    rotation: 0,
    vertexes: {
        forward: 0,
        strafe: 0,
        rotation: 0
    },
    leftTopWheel: {
        vertexX: 0,
        vertexY: 0,
        getWheelX: function () {
            return robot.X + 15 * Math.cos(robot.rotation) - 15 * Math.sin(robot.rotation);
        },
        getWheelY: function () {
            return robot.Y - 15 * Math.cos(robot.rotation) - 15 * Math.sin(robot.rotation);
        }
    },
    rightTopWheel: {
        vertexX: 0,
        vertexY: 0,
        getWheelX: function () {
            return robot.X - 15 * Math.cos(robot.rotation) - 15 * Math.sin(robot.rotation);
        },
        getWheelY: function () {
            return robot.Y - 15 * Math.cos(robot.rotation) + 15 * Math.sin(robot.rotation);
        }
    },
    rightBottomWheel: {
        vertexX: 0,
        vertexY: 0,
        getWheelX: function () {
            return robot.X - 15 * Math.cos(robot.rotation) + 15 * Math.sin(robot.rotation);
        },
        getWheelY: function () {
            return robot.Y + 15 * Math.cos(robot.rotation) + 15 * Math.sin(robot.rotation);
        }
    },
    leftBottomWheel: {
        vertexX: 0,
        vertexY: 0,
        getWheelX: function () {
            return robot.X + 15 * Math.cos(robot.rotation) + 15 * Math.sin(robot.rotation);
        },
        getWheelY: function () {
            return robot.Y + 15 * Math.cos(robot.rotation) - 15 * Math.sin(robot.rotation);
        }
    },
    drawWheels: function () {
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
    updateWheelVertexes: function () {
        var A = Math.max(Math.min(robot.vertexes.strafe - robot.vertexes.rotation * 15, 15), -15),
            B = Math.max(Math.min(robot.vertexes.strafe + robot.vertexes.rotation * 15, 15), -15),
            C = Math.max(Math.min(-robot.vertexes.forward - robot.vertexes.rotation * 15, 15), -15),
            D = Math.max(Math.min(-robot.vertexes.forward + robot.vertexes.rotation * 15, 15), -15);

        robot.leftTopWheel.vertexX = B;
        robot.leftTopWheel.vertexY = D;

        robot.rightTopWheel.vertexX = B;
        robot.rightTopWheel.vertexY = C;

        robot.rightBottomWheel.vertexX = A;
        robot.rightBottomWheel.vertexY = C;

        robot.leftBottomWheel.vertexX = A;
        robot.leftBottomWheel.vertexY = D;
    },
    cleanValues: function () {
        robot.rotation %= 2 * Math.PI;
        if (robot.X < 0) {
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

document.onkeydown = function (e) {
    switch (e.keyCode) {
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
        robot.rotation -= Math.PI / 8;
        break;
    case 90:
        robot.rotation += Math.PI / 8;
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
        robot.vertexes.rotation += Math.PI / 8;
        robot.updateWheelVertexes();
        break;
    case 81:
        robot.vertexes.rotation -= Math.PI / 8;
        robot.updateWheelVertexes();
        break;
    }
    robot.cleanValues();
};

var update = function () {
    if (navigator.getGamepads()[0]) {
        gamePad = navigator.getGamepads()[0];
        if (vertexMode) {
            if (Math.abs(gamePad.axes[0]) > 0.1) {
                robot.vertexes.strafe = 15 * gamePad.axes[0];
            } else {
                robot.vertexes.strafe = 0;
            }
            if (Math.abs(gamePad.axes[1]) > 0.1) {
                robot.vertexes.forward = -(15 * gamePad.axes[1]);
            } else {
                robot.vertexes.forward = 0;
            }
            if (Math.abs(gamePad.axes[2]) > 0.1) {
                robot.vertexes.rotation = gamePad.axes[2] * Math.PI;
            } else {
                robot.vertexes.rotation = 0;
            }
            robot.updateWheelVertexes();
        } else {
            if (Math.abs(gamePad.axes[0]) > 0.1) {
                robot.X += 5 * gamePad.axes[0];
            }
            if (Math.abs(gamePad.axes[1]) > 0.1) {
                robot.Y += 5 * gamePad.axes[1];
            }
            if (Math.abs(gamePad.axes[2]) > 0.1) {
                robot.rotation -= gamePad.axes[2] * Math.PI / 8;
            }
        }
        if (gamePad.buttons[10].pressed) {
            vertexMode = !vertexMode;
        }
        if (gamePad.buttons[8].pressed) {
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
    ctx.clearRect(0, 0, 300, 300);
    robot.drawWheels();
    updateWheelStats();
    requestAnimationFrame(update);
};
