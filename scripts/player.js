var player = (function () {
    function changeMovementAngle(player) {
        if (player.isRightPressed) {
            player.movementAngle += PLAYER.MOVEMENT_ANGLE_CHANGE;
        } else if (player.isLeftPressed) {
            player.movementAngle -= PLAYER.MOVEMENT_ANGLE_CHANGE;
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
        if (player.y < 0) {
            player.y = gameField.height;
        }
        if (player.y > gameField.height) {
            player.y = 0;
        }
        if (player.x < 0) {
            player.x = gameField.width;
        }
        if (player.x > gameField.width) {
            player.x = 0;
        }
    }

    function givePointsToAlivePlayers() {
        players.forEach(function updatePlayerScore(player) {
            if (player.states.isAlive) {
                player.points += 1;
            }
        })
    }

    function checkCollision(player) {
        var modifierVectorLength = Math.sqrt(player.xModifier * player.xModifier + player.yModifier * player.yModifier);
        var modifierNormalizer = 1 / modifierVectorLength;

        var colors = gameFieldCtx.getImageData(
            player.x + (PLAYER.RADIUS + 2) * (player.xModifier * modifierNormalizer),
            player.y + (PLAYER.RADIUS + 2) * (player.yModifier * modifierNormalizer), 1, 1).data;
        if (colors[0] !== 0 || colors[1] !== 0 || colors[2] !== 0) {
            //console.log(player.name  + ' - R:' + colors[0] + ' G:' + colors[1] + ' B:' + colors[2] + ' A:' + colors[3] + ' mV:' + modifierNormalizer + ' Xm:' + player.xModifier + ' Ym:' + player.yModifier);
            player.states.isAlive = false;
            givePointsToAlivePlayers();
        }
    }

    function drawPath(player) {
        gameFieldCtx.fillStyle = player.fillStyle;
        gameFieldCtx.beginPath();
        gameFieldCtx.arc(player.x, player.y, PLAYER.RADIUS, 0, 2 * Math.PI);
        gameFieldCtx.fill();
        gameFieldCtx.strokeStyle = "brown";
        if (Math.random() < 0.05) {
            gameFieldCtx.stroke();
        }
        gameFieldCtx.closePath();
    }

    var currentId = 0,
        player = Object.create({}),
        PLAYER = {
            RADIUS: 12,
            MOVEMENT_ANGLE_CHANGE: 4
        };

    Object.defineProperty(player, 'init', {
        value: function (name) {
            this.x = parseInt(Math.random() * gameField.width);
            this.y = parseInt(Math.random() * gameField.height);
            this.xModifier = 1;
            this.yModifier = 0;
            this.id = ++currentId;
            this.name = name;
            this.fillStyle = '#' + Math.random().toString(16).substr(-6);
            this.movementAngle = 0;
            this.isLeftPressed = false;
            this.isRightPressed = false;
            this.states = {isAlive: true};
            this.points = 0;
            return this;
        }
    });

    Object.defineProperty(player, 'movementAngle', {
        get: function () {
            return this._movementAngle;
        },
        set: function (value) {
            if (value < 0) {
                this._movementAngle = 360 - PLAYER.MOVEMENT_ANGLE_CHANGE;
            } else if (value > 360) {
                this._movementAngle = PLAYER.MOVEMENT_ANGLE_CHANGE;
            } else {
                this._movementAngle = value;
            }
        }
    });

    Object.defineProperty(player, 'move', {
        value: function () {
            if (this.states.isAlive) {
                checkCollision(this);
                changeMovementAngle(this);
                changeModifiers(this);
                changePosition(this);
                drawPath(this);
            }
        }
    });

    return player;
}());

var playersToAdd = [],
    players = [];

var player1 = Object.create(player).init('PlayerOne'),
    player2 = Object.create(player).init('PlayerTwo'),
    player3,
    player4;

players.push(player1);
players.push(player2);

function AddPlayers() {
    if (playersToAdd[0]) {
        player3 = Object.create(player).init(playersToAdd[0].name);
        addEventListener(player3, 'keydown', playersToAdd[0].moveLeft, playersToAdd[0].moveRight);
        addEventListener(player3, 'keyup', playersToAdd[0].moveLeft, playersToAdd[0].moveRight);
        players.push(player3);
    }

    if (playersToAdd[1]) {
        player4 = Object.create(player).init(playersToAdd[1].name);
        addEventListener(player4, 'keydown', playersToAdd[1].moveLeft, playersToAdd[1].moveRight);
        addEventListener(player4, 'keyup', playersToAdd[1].moveLeft, playersToAdd[1].moveRight);
        players.push(player4);
    }
}

function reinitPlayer(player) {
    player.x = parseInt(Math.random() * gameField.width);
    player.y = parseInt(Math.random() * gameField.height);
    player.states.isAlive = true;
}
function aliveCount(players) {
    var counter = 0;
    for (var i = 0; i < players.length; i += 1) {
        if (players[i].states.isAlive) {
            counter += 1;
        }
    }
    return counter;
}