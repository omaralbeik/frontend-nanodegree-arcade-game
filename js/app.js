
// constants
var kCanvas = {
    "width":505,
    "height":606,
    "grid": {
        "rows":6,
        "columns": 5
    },
    "block": {
        "width":101,
        "height":83
    }
};

var kEnemies = {
    "maxCount":5,
    "startingX":-100,
    "startingY":60
};

var kPlayer = {
    "startingX":202,
    "startingY":386,
    "lives":3
};

var gameIsOver = false;
var prizeIsTaken = false;

// helpers
// createRandomNumber function creates a random number between min and max included:
var randomNumber = function(min, max) {
   return number = Math.floor(Math.random() * (max+1 - min)) + min;
}

var gameOver = function() {
    gameIsOver = true;
    $('body').append('<div class="alert alert-danger text-center" id="alert">Game Over!, press space bar to play again.</div>');
}



// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = randomNumber(1, 5);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // by multiplying any movement by the dt parameter
    // we ensure the game will run at the same speed for
    // all computers.
    this.x  = this.x + 100 * dt * this.speed;
    if (this.x >= kCanvas.width) {
        this.x = kEnemies.startingX;
        var randomLine = randomNumber(0, 3);
        this.y = kEnemies.startingY + (kCanvas.block.height * randomLine);
        this.speed = randomNumber(1,5);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


function createEnemies() {
   for (var i=0;i<kEnemies.maxCount; i++) {
      var randomLine = randomNumber(0,3);
      var randomSpeed = randomNumber(1,5);
      var enemy = new Enemy(kEnemies.startingX, kEnemies.startingY + (kCanvas.block.height * randomLine), randomSpeed);
      allEnemies.push(enemy);
   }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.currentBlock = {
        "row":4,
        "column":2
    }
    this.lives = kPlayer.lives;
};

Player.prototype.update = function(dt) {
    for (var enemy in allEnemies) {
        if ((Math.abs(this.x - allEnemies[enemy].x) <= 50) && (Math.abs(this.y - allEnemies[enemy].y) <= 50)) {
            this.lives--;
            this.x = kPlayer.startingX;
            this.y = kPlayer.startingY;
            this.currentBlock = {
                "row":4,
                "column":2
            }
        }
    }

    if (this.lives < 1) {
        if (!gameIsOver) {
            gameOver();
        };
    };
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {

    if (this.lives > 0) {

        switch (key) {

        case 'right':
            if (this.currentBlock.column < 4) {
                this.x += kCanvas.block.width;
                this.currentBlock.column++;
            };
            break;

        case 'left':
            if (this.currentBlock.column > 0) {
                this.x -= kCanvas.block.width;
                this.currentBlock.column--;
            };
            break;

        case 'up':
            if (this.currentBlock.row > 0) {
                this.y -= kCanvas.block.height;
                this.currentBlock.row--;
            } else {
                this.lives--;
                this.y = kPlayer.startingY;
                this.currentBlock.y = 0;
            };

            if (this.lives == 0) {
                gameOver();
            };

            break;

        case 'down':
            if (this.currentBlock.row < 4) {
                this.y += kCanvas.block.height;
                this.currentBlock.row++;
            };
            break;

        default:
            break;
        }

    } else {
        
        if (key == 'space') {
            gameIsOver = false;
            this.lives = 3;
            $("#alert").fadeTo(200, 500).slideUp(100, function(){
                $("#alert").alert('close');
            });
        }
    };

    console.log(this.currentBlock.row);
    console.log(this.currentBlock.column);

};

var Prize = function(row, column) {
    this.row = row;
    this.column = column;
    this.sprite = 'images/Star.png';
    this.y = 70 + kCanvas.block.height * row;
    this.x = kCanvas.block.width * column;
}

Prize.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Prize.prototype.update = function() {
    if (this.row == player.currentBlock.row && this.column == player.currentBlock.column) {
        console.log('prize taken');
        var randomRow = randomNumber(0, 3);
        var randomColumn = randomNumber(0, 4);

        this.row = randomRow;
        this.column = randomColumn;
        this.y = 70 + kCanvas.block.height * randomRow;
        this.x = kCanvas.block.width * randomColumn;
    };
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37:'left',
        38:'up',
        39:'right',
        40:'down',
        32:'space' // to restart the game
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function createPrize() {
    var randomRow = randomNumber(0, 3);
    var randomColumn = randomNumber(0, 4);
    var prize = new Prize(randomRow, randomColumn);
    return prize;

}

var prize = createPrize();
var player = new Player(kPlayer.startingX, kPlayer.startingY);
// All enemy objects  are places in allEnemies array
var allEnemies = [];
createEnemies();



