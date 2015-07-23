var gamefield = document.getElementById('game-field'),
	gamefieldCtx = gamefield.getContext('2d');

var CONSTANTS = {
    PLAYER_RADIUS: 5
};

var player = (function() {
    function changeMovementAngle(player) {
        if (player.isRightPressed) {
            player.movementAngle += 4 ;
        } else if (player.isLeftPressed) {
            player.movementAngle -= 4;
        }
    }

    function changeModifiers(player) {
        if (0 <= player.movementAngle && player.movementAngle <= 90) {
            player.yModifier = player.movementAngle / 90;
            player.xModifier = (90 - player.movementAngle) / 90;
        } else if (90 < player.movementAngle && player.movementAngle <= 180) {
            player.yModifier = (180 - player.movementAngle) / 90;
            player.xModifier = (90 - player.movementAngle) / 90;
        } else if (180 < player.movementAngle && player.movementAngle <= 270) {
            player.yModifier = (180 - player.movementAngle) / 90;
            player.xModifier = (player.movementAngle - 270) / 90;
        } else {
            player.yModifier = (player.movementAngle - 360) / 90;
            player.xModifier = (player.movementAngle - 270) / 90;
        }
    }

    function changePosition(player) {
        player.x += 2 * player.xModifier;
        player.y += 2 * player.yModifier;
    }

    var currentId = 0,
        fieldWidth = +gamefield.getAttribute('width');
    	fieldHeight = +gamefield.getAttribute('height');
    	player = Object.create({});

    Object.defineProperty(player, 'init', {
        value: function(name) {
            this.x = parseInt(Math.random() * fieldWidth);
            this.y = parseInt(Math.random() * fieldHeight);
            this.xModifier = 1;
            this.yModifier = 0;
            this.id = ++currentId;
            this.name = name;
            this.movementAngle = 0;
            this.isLeftPressed = false;
            this.isRightPressed = false;
            return this;
        }
    });

    Object.defineProperty(player, 'movementAngle', {
        get: function() {
            return this._movementAngle;
        },
        set: function(value) {
            if (value < 0) {
                this._movementAngle = 360 - 4;
            } else if (value > 360) {
                this._movementAngle = 0 + 4;
            } else {
                this._movementAngle = value;
            }
        }
    });

    Object.defineProperty(player, 'update', {
        value: function() {
            changeMovementAngle(this);
            changeModifiers(this);
            changePosition(this);
        }
    });

    return player;
}());

function beginGame() {
    player1.update();

    var modifierVectorLength = Math.sqrt(Math.abs(player1.xModifier, player1.yModifier));
    var normalizeModifierVal = 1/modifierVectorLength;

    var colors = gamefieldCtx.getImageData(
    				player1.x + (CONSTANTS.PLAYER_RADIUS + 1) * player1.xModifier*normalizeModifierVal,
    				player1.y + (CONSTANTS.PLAYER_RADIUS + 1) * player1.yModifier*normalizeModifierVal, 1, 1).data;
    if (colors[0] !== 0 || colors[2] !== 0 || colors[1] !== 0) {
        console.log(colors[0] + ' ' + colors[1] + ' ' + colors[2] + " " + colors[3]);
    }

    gamefieldCtx.fillStyle = 'green';
    gamefieldCtx.beginPath();
    gamefieldCtx.arc(player1.x, player1.y, CONSTANTS.PLAYER_RADIUS, 0, 2 * Math.PI);
    gamefieldCtx.fill();
    gamefieldCtx.closePath();

    player2.update();
    gamefieldCtx.fillStyle = 'blue';
    gamefieldCtx.beginPath();
    gamefieldCtx.arc(player2.x, player2.y, CONSTANTS.PLAYER_RADIUS, 0, 2 * Math.PI);
    gamefieldCtx.fill();
    gamefieldCtx.closePath();
    requestAnimationFrame(beginGame);
}

var player1 = Object.create(player).init('PlayerOne');
var player2 = Object.create(player).init('PlayerTwo');

document.addEventListener('keydown', function(ev) {
    if (ev.keyCode == 68) {
        player1.isRightPressed = true;
    } else if (ev.keyCode == 65) {
        player1.isLeftPressed = true;
    }
}, false);

document.addEventListener('keyup', function(ev) {
    if (ev.keyCode == 68) {
        player1.isRightPressed = false;
    } else if (ev.keyCode == 65) {
        player1.isLeftPressed = false;
    }
}, false);

document.addEventListener('keydown', function(ev) {
    if (ev.keyCode == 39) {
        player2.isRightPressed = true;
    } else if (ev.keyCode == 37) {
        player2.isLeftPressed = true;
    }
}, false);

document.addEventListener('keyup', function(ev) {
    if (ev.keyCode == 39) {
        player2.isRightPressed = false;
    } else if (ev.keyCode == 37) {
        player2.isLeftPressed = false;
    }
}, false);

beginGame();