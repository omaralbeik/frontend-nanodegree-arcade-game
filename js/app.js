
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

// game status
var gameStarted = false;
var gameOver = false;

var kEnemies = {
    "maxCount":3,
    "startingX":0,
    "startingY":60
};

var kPlayer = {
    "startingX":202,
    "startingY":386,
    "lives":3
};

// helpers
// createRandomNumber function creates a random number between min and max included:
var randomNumber = function(min, max) {
   return number = Math.floor(Math.random() * (max+1 - min)) + min;
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
        "x":2,
        "y":0
    }
    this.lives = kPlayer.lives;
};

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {

  switch (key) {

    case 'right':
        if (this.currentBlock.x < 4) {
            console.log(key)
            this.x += kCanvas.block.width;
            this.currentBlock.x++;
        };
        break;

    case 'left':
        if (this.currentBlock.x > 0) {
            console.log(key)
            this.x -= kCanvas.block.width;
            this.currentBlock.x--;
        };
        break;

    case 'up':
        if (this.currentBlock.y < 5) {
            console.log(key)
            this.y -= kCanvas.block.height;
            this.currentBlock.y++;
        };
        break;

    case 'down':
        if (this.currentBlock.y > 0) {
            console.log(key)
            this.y += kCanvas.block.height;
            this.currentBlock.y--;
        };

        break;

    default:
        break;
  }


};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37:'left',
        38:'up',
        39:'right',
        40:'down',
        32:'space' // for jump
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


var player = new Player(kPlayer.startingX, kPlayer.startingY);
// All enemy objects  are places in allEnemies array
var allEnemies = [];
createEnemies();



