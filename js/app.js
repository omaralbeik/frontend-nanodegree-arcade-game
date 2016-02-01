////////////////////////// Global //////////////////////////

// kCanvas object contains all constants for HTML canvas
var kCanvas = {
  width: 505,
  height: 606,
  grid: {
    rows: 6, // see engine.js for more info on how rows are ordered.
    columns: 5
  },
  block: {
    // size of each block in canvas.
    width: 101,
    height: 83
  }
};

// kEnemies object contains all constants for enemy objects
var kEnemies = {
  maxCount: 4, // number of enemies that appear at the same time
  // stating point for enemies, by starting x from outside the canvas
  // it will look like they are entering.
  startingX: -120,
  startingY: 60,
  minSpeed: 1, // change minimum speed of enemies here. (should be > 0).
  maxSpeed: 5 // change maximum speed of enemies here. (should be > minSpeed)
};

// kPlayer object contains all constants for player objects
var kPlayer = {
  startingX: 202,
  startingY: 386,
  lives: 3, // change this to change the number of lives
  // initial block user starts from.
  initialBlock: {
    row: 4,
    column: 2
  }
};

// global variable will be true only if game is over.
var gameIsOver = false;

// global variable to keep track of number of stars collected
var starsCollected = 0;

// HTML objects
var $lives = $('#lives');
var $stars = $('#stars');



////////////////////////// Helpers //////////////////////////

// createRandomNumber function creates a random number between min and max included:
var randomNumber = function(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

// gameOver function shows alert when game is over
var gameOver = function() {
  gameIsOver = true;
  $('body').append('<div class="container"><div class="alert alert-danger text-center" id="alert"><strong>Game Over!</strong>, press space bar to play again.</div></div>');
};

var showAlert = function(alertString) {
  $('body').append('<div class="container"><div class="alert alert-warning text-center" id="notification">' + alertString + '</div></div>');
  $("#notification").fadeTo(3000, 500).slideUp(100, function() {
    $("#notification").alert('close');
  });
};



////////////////////////// Enemies //////////////////////////

var Enemy = function(x, y) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = y;
  this.speed = randomNumber(kEnemies.minSpeed, kEnemies.maxSpeed); // initial speed for enemies.
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // by multiplying any movement by the dt parameter
  // we ensure the game will run at the same speed for
  // all computers.
  this.x = this.x + 100 * dt * this.speed;
  // we check if enemy ran out of canvas, they we change his row and
  // speed values to new random values
  if (this.x >= kCanvas.width) {
    var randomLine = randomNumber(0, kCanvas.grid.rows - 3);
    this.y = kEnemies.startingY + (kCanvas.block.height * randomLine);
    this.speed = randomNumber(kEnemies.minSpeed, kEnemies.maxSpeed);
    this.x = kEnemies.startingX;
  }
};

// Draw the enemy on the screen, required method for game
// refer to engine.js for more info.
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// this function is called one time at the game launch to create enemies
// for the first time, then we keep re-using this to avoid creating the same
// object over and over again.
function createEnemies() {
  for (var i = 0; i < kEnemies.maxCount; i++) {
    var randomLine = randomNumber(0, kCanvas.grid.rows - 3);
    var randomSpeed = randomNumber(kEnemies.minSpeed, kEnemies.maxSpeed);
    var randomRow = kEnemies.startingY + (kCanvas.block.height * randomLine);
    var enemy = new Enemy(kEnemies.startingX, randomRow, randomSpeed);
    allEnemies.push(enemy);
  }
}



////////////////////////// Player //////////////////////////

var Player = function(x, y) {
  this.sprite = 'images/char-boy.png';
  this.x = x;
  this.y = y;
  // currentRow and currentColumn objects keep track of the
  // current row and column player is currently on
  this.currentRow = kPlayer.initialBlock.row;
  this.currentColumn = kPlayer.initialBlock.column;
  this.lives = kPlayer.lives;
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
  for (var enemy in allEnemies) {
    // player loses a life if in range of 50 px or less from enemy
    if ((Math.abs(this.x - allEnemies[enemy].x) <= 50) && (Math.abs(this.y - allEnemies[enemy].y) <= 50)) {
      this.lives--;
      this.x = kPlayer.startingX;
      this.y = kPlayer.startingY;
      this.currentRow = kPlayer.initialBlock.row;
      this.currentColumn = kPlayer.initialBlock.column;
      if (this.lives > 0) {
        showAlert("<strong>-1 </strong>Beware of the enemies!");
      }
    }
  }

  // if lives is 0 then game is over
  if (this.lives < 1) {
    // prevent gameOver method from being called more than 1 time
    // each time
    if (!gameIsOver) {
      gameOver();
    }
  }

  // update lives title
  $lives.text(this.lives);
};

// Draw the player on the screen, required method for game
// refer to engine.js for more info.
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handle user input to move the player
Player.prototype.handleInput = function(key) {

  // first things first, player can't move if game is over
  if (this.lives > 0) {

    // check all allowed cases to move the player:
    // right, left, up, down
    switch (key) {

      case 'right':
        // player tapped the right arrow on keyboard
        if (this.currentColumn < 4) {
          this.x += kCanvas.block.width;
          this.currentColumn++;
        }
        break;

      case 'left':
        // player tapped the left arrow on keyboard
        if (this.currentColumn > 0) {
          this.x -= kCanvas.block.width;
          this.currentColumn--;
        }
        break;

      case 'up':
        // player tapped the up arrow on keyboard
        if (this.currentRow > 0) {
          this.y -= kCanvas.block.height;
          this.currentRow--;
        } else {

          // then the player jumped into the water
          this.lives--;
          this.currentRow = kPlayer.initialBlock.row;
          this.currentColumn = kPlayer.initialBlock.column;
          this.x = kPlayer.startingX;
          this.y = kPlayer.startingY;
          if (this.lives > 0) {
            showAlert("<strong>-1 </strong>You can't jump into water!");
          }

        }
        break;

      case 'down':
        // player tapped the down arrow on keyboard
        if (this.currentRow < 4) {
          this.y += kCanvas.block.height;
          this.currentRow++;
        }
        break;

      default:
        break;
    }

  } else {

    if (key == 'space') {
      // player tapped the space bar on keyboard
      gameIsOver = false;
      this.lives = 3;
      starsCollected = 0;
      $stars.text(starsCollected);
      $("#alert").fadeTo(200, 500).slideUp(100, function() {
        $("#alert").alert('close');
      });
    }
  }

};




////////////////////////// Star //////////////////////////

var Star = function(row, column) {
  this.row = row;
  this.column = column;
  this.sprite = 'images/Star.png';
  this.y = 70 + kCanvas.block.height * row;
  this.x = kCanvas.block.width * column;
};

// Draw the star on the screen, required method for game
// refer to engine.js for more info.
Star.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the star's position, required method for game
// Parameter: dt, a time delta between ticks
Star.prototype.update = function() {
  if (this.row == player.currentRow && this.column == player.currentColumn) {
    // a star is collected
    starsCollected++;
    $stars.text(starsCollected);
    var randomRow = randomNumber(0, kCanvas.grid.rows - 3);
    var randomColumn = randomNumber(0, kCanvas.grid.columns - 1);

    this.row = randomRow;
    this.column = randomColumn;
    this.y = 70 + kCanvas.block.height * randomRow;
    this.x = kCanvas.block.width * randomColumn;
  }
};

// helper function to create the star for the first time the game
// starts, then only position is changed to avoid creating the same
// object again and again..
function createStar() {
  // stars should only be created where enemies can walk
  var randomRow = randomNumber(0, kCanvas.grid.rows - 3);
  var randomColumn = randomNumber(0, kCanvas.grid.columns - 1);
  var star = new Star(randomRow, randomColumn);
  return star;
}


////////////////////////// Document //////////////////////////

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'space' // to restart the game
  };
  player.handleInput(allowedKeys[e.keyCode]);
});



//////////////////// initialize the game ////////////////////

var star = createStar();
var player = new Player(kPlayer.startingX, kPlayer.startingY);

// All enemy objects  are places in allEnemies array
// refer to engine.js for more info.
var allEnemies = [];

createEnemies();
