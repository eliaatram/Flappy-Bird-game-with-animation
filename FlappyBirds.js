/**
 * Created by: Elia El Atram
 * 
 * Presented to: Dr. Dani Nini
 * 
 * Final Game
 * 
 * Flappy Brid Game
 * 
 * The following is a Flappy bird game where the player has to fly a bird between pipes, 
 * collecting coins and power ups along the game, and completing levels.
 */

var canvas = document.getElementById("EliaCanvas"); // getting the canvas
var ctx = this.canvas.getContext("2d"); // getting the context


/*  Game Criterias    */
var score = 0; // initial game score
var lifes = 3; // intitial number of lifes
var level = 1; // initital level
var choice = false; // user choice whether to play or no
var choice2 = false; // user choice of the environment
var endGame = false; // ending the game state


/* Handling Bakcground image and environment */
var backgroundImage = new Image();
backgroundImage.src = "assets/background.png";
var day = false;


/* Power ups present in the game */
var powerUpSmall = false; // makes the bird smaller
var powerUpWide = false; // makes the gap between the pipes bigger
var powerUpGravity = false; // dimishes the gravity
var bonus = false; // doubles the coins
var powerUpTimer = 0; // timer of the power ups


// changing the background based on the users choice
// this imgae object will be constintly changing when the user presses different options of the game like play or end
var mainMenu = new Image();
mainMenu.src = "assets/mainMenu.png";


// taking input from the user
var keysdown = [];

// add an eventListener to browser window
addEventListener("keydown", (e) => {
    keysdown[e.keyCode] = true;
}, false);

// add an eventListener to browser window
addEventListener("keyup", (e) => {
    delete keysdown[e.keyCode];
}, false);


var pipe = []; // pipes array
var coins = [] // coins array

// pipe coordinates
pipe[0] = {

    x: canvas.width,
    y: 0,

};

// pipe coordinates
coins[0] = {

    x: canvas.width,
    y: 0,

};


// the menu function that will handle the change of the background
function menu(ctx) {
    ctx.drawImage(mainMenu, 0, 0);
}


// assigning first options of the user
function options(event) {
    var x = event.clientX;
    var y = event.clientY;

    // starting the game
    if (x >= 91 && x < 212 && y >= 149 && y < 169) {
        choice = true;
        theme.play();
    }

    // displaying a message for the end of the game
    else if (x >= 91 && x < 206 && y >= 292 && y < 312) {
        ctx.fillStyle = "#EC7E00";
        ctx.font = "16px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "center";
        ctx.fillText("Thanks for Playing", 140, 230);
        theme.stop();
        endGame = true;
        return false;
    }
}


// assigning second options of the user
function options2(event) {
    var x = event.clientX;
    var y = event.clientY;

    // starting the game
    if (x >= 114 && x < 180 && y >= 112 && y < 128) {
        backgroundImage.src = "assets/background.png";
        choice2 = true;
        day = true;
    }

    else if (x >= 112 && x < 200 && y >= 329 && y < 345) {
        backgroundImage.src = "assets/nightBackground.png";
        choice2 = true;
        day = false;
    }
}


// creating the sound function
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}

// sound effects used in the game
var theme = new sound("sounds/flappyTheme.mp3"); // game theme song
var flying = new sound("sounds/flappyFlying.wav"); // flappy bird falling down sound effect
var flappyCoin = new sound("sounds/flappyCoin.wav") // flappy bird collecting a coin
var flappyHit = new sound("sounds/flappyHit.wav"); // flappy bird hitting a pipe
var flappyDead = new sound("sounds/flappyDie.wav"); // flappy dying sound effect
var smallerBird = new sound("sounds/smallerBird.mp3"); // smaller bird sound effect
var widerPipes = new sound("sounds/widerPipes.mp3"); // wider pipes sound effect
var lowGravity = new sound("sounds/lowGravity.mp3"); // low gravity sound effect
var doubleCoins = new sound("sounds/doubleCoins.mp3"); // double coins sound effect
var flappyWon = new sound("sounds/flappyWon.wav"); // player won the game sound effect


// Create the class Game
class Game {

    // constructor of the class
    constructor() {
        this.width = 288; // setting the width
        this.height = 512; // setting the height
        this.spritesArray = []; // declaring the sprites array
        this.canvas = document.getElementById("EliaCanvas"); // getting the canvas
        this.ctx = this.canvas.getContext("2d"); // getting the context
    }

    // update of the class
    update() {
        for (var i = 0; i < this.spritesArray.length; i++)
            this.spritesArray[i].update(); // updating the elements of the sprites array
    }

    // drawing the class elements
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.spritesArray.length; i++)
            this.spritesArray[i].draw(this.ctx); // drawing the elements of the sprites array
    }

    // add elements to the sprites array
    addSprite(paramSprite) {
        this.spritesArray.push(paramSprite)
    }

}

// Creating the abstract Sprite class
class Sprite {

    constructor() { }

    update() { }

    draw() { }
}


// Bakcground class of the game
class Background {

    // constructor of the class
    constructor() {
        this.backgroundReady = false; // state of the background image
        backgroundImage.onload = () => {
            this.backgroundReady = true;
        }
    }

    // draw function of the class
    draw(ctx) {
        if (this.backgroundReady) {
            ctx.drawImage(backgroundImage, 0, 0);
        }
    }

    update() {

    }
}


// Floor class of the game
class Floor {

    // constructor of the class
    constructor() {
        this.floorImage = new Image(); // image of the floor element
        this.floorReady = false; // state of the floor image
        this.floorImage.src = "assets/floor.png";
        this.floorImage.onload = () => {
            this.floorReady = true;
        }
    }

    // draw function of the class
    draw(ctx) {
        ctx.drawImage(this.floorImage, 0, canvas.height - this.floorImage.height);
    }

    update() {

    }
}


// Pipes class of the game
class Pipes {

    /**
     * 
     * @param {*} bird object of the game
     * @param {*} floor object of the game
     */
    constructor(bird, floor) {
        this.pipeUpImage = new Image(); // pipe at the south of the canvas
        this.pipeDownImage = new Image(); // pipe at the north of tha canvas
        this.coinImage = new Image(); // coin image

        // south pipe state
        this.pipeUpReady = false;
        this.pipeUpImage.src = "assets/pipeUp.png";
        this.pipeUpImage.onload = () => {
            this.pipeUpReady = true;
        }

        // north pipe state
        this.pipeDownReady = false;
        this.pipeDownImage.src = "assets/pipeDown.png";
        this.pipeDownImage.onload = () => {
            this.pipeDownReady = true;
        }

        // coin state
        this.coinReady = false;
        this.coinImage.src = "spriteSheets/coinsAnimation.png";
        this.coinImage.onload = () => {
            this.coinReady = true;
        }

        this.coinWidth = 20; // width of the coin image
        this.coinHeight = 20; // height of the coin image

        this.bird = bird; // bird object
        this.floor = floor; // floor object

        this.pipeGaps = 100; // the gap between the northern and southern pipe

        this.collected = false; // state of the coins

        this.frameX = 0; // x axis frame of the coin and power ups sprite sheet
        this.frameY = 0; // y axis frame of the coin and power ups sprite sheet
        this.frameWidth = 190; // width of the frame
        this.frameHeight = 193; // height of the frame
        this.frameTimer = 0; // timer of the frames to be shown
    }

    // draw function of the class
    draw(ctx) {

        /* handling the gaps between pipes */
        if (powerUpWide) {
            this.pipeGaps = 120; // changing the gaps between both pipes to suit the power up
        }

        else if (level === 2) {
            this.pipeGaps = 90; // changing the gaps between both pipes to suit the second level of the game
        }

        else {
            this.pipeGaps = 100; // normal gap between the pipes
        }


        // drawing the pipe images 
        for (var i = 0; i < pipe.length; i++) {

            this.constentGap = this.pipeUpImage.height + this.pipeGaps; // setting the gap between the pipes

            if (this.pipeUpReady) {
                ctx.drawImage(this.pipeUpImage, pipe[i].x, pipe[i].y); // drawing the northern pipe
            }

            if (this.pipeDownReady) {
                ctx.drawImage(this.pipeDownImage, pipe[i].x, pipe[i].y + this.constentGap); // drawing the southern pipe
            }
        }


        // drawing the coin images and the power ups
        if (this.coinReady && this.collected === false) {
            if (score === 5) {
                this.coinImage.src = "spriteSheets/smallBird.png"; // red power up
            }

            else if (score === 10) {
                this.coinImage.src = "spriteSheets/widerPipes.png"; // green power up
            }

            else if (score === 15) {
                this.coinImage.src = "assets/doubleCoins.png"; // double coins(2X) power up
            }

            else if (score === 25) {
                this.coinImage.src = "spriteSheets/smallGravity.png"; // blue power up
            }

            else {
                this.coinImage.src = "spriteSheets/coinsAnimation.png";
            }
        }

        // showing the first frame of the coin and power up sprite sheet
        if (this.frameTimer <= 15) {
            this.frameX = 0;
        }

        // showing the second frame of the coin and power up sprite sheet
        else if (this.frameTimer <= 30) {
            this.frameX = 200;
        }

        // showing the third frame of the coin and power up sprite sheet
        else if (this.frameTimer <= 45) {
            this.frameX = 410;
        }

        // showing the fourth frame of the coin and power up sprite sheet
        else if (this.frameTimer <= 60) {
            this.frameX = 620;
        }

        // showing the fifth frame of the coin and power up sprite sheet
        else if (this.frameTimer <= 75) {
            this.frameX = 830;
        }

        // showing the sixth frame of the coin and power up sprite sheet
        else if (this.frameTimer <= 80) {
            this.frameX = 1010;

        }

        // drawing the corresponding coins and power ups sprite sheet and images
        for (var i = 0; i < coins.length; i++) {

            if (this.coinReady) {

                // drawing the non-animated double coins power up
                if (score === 15) {
                    ctx.drawImage(this.coinImage, coins[i].x + this.pipeUpImage.width / 3, coins[i].y +
                        this.pipeUpImage.height + this.pipeGaps / 2, this.coinWidth, this.coinHeight);
                }

                // drawing the animated coins and power ups
                else {
                    ctx.drawImage(this.coinImage, this.frameX, this.frameY, this.frameWidth, this.frameHeight,
                        coins[i].x + this.pipeUpImage.width / 3, coins[i].y +
                        this.pipeUpImage.height + this.pipeGaps / 2,
                        this.coinWidth, this.coinHeight);
                }
            }
        }
    }

    // update function of the class
    update() {

        this.frameTimer++; // incrementing the timer of the frames
        if (this.frameTimer >= 80) {
            this.frameTimer = 0; // resetting the frame timer to 0
        }


        /* Handling the power ups of the game by incrementing their effect until they are displayed for 10 seconds 
         * when the power up is true, it will effect the game for 10 seconds and then it is set to false and the timer
         * is set to 0 
        */
        // small bird power up
        if (powerUpSmall === true) {
            powerUpTimer++;
            if (powerUpTimer >= 600) {
                powerUpSmall = false;
                powerUpTimer = 0;
            }
        }

        // wide pipes power up
        if (powerUpWide === true) {
            powerUpTimer++;
            if (powerUpTimer >= 600) {
                powerUpWide = false;
                powerUpTimer = 0;
            }
        }

        // low gravity power up
        if (powerUpGravity === true) {
            powerUpTimer++;
            if (powerUpTimer >= 600) {
                powerUpGravity = false;
                powerUpTimer = 0;
            }
        }

        // double coins power up
        if (bonus === true) {
            powerUpTimer++;
            if (powerUpTimer >= 600) {
                bonus = false;
                powerUpTimer = 0;
            }
        }

        // hanlding the movement of the pipes and adding other pipes to the game
        for (var i = 0; i < pipe.length; i++) {
            pipe[i].x--; // moving the pipes towards the bird

            // addin new pipes 
            if (pipe[i].x == 80) {

                // random y axis position of the pipes and coins
                var position = Math.floor(Math.random() * this.pipeUpImage.height);

                // adding the new pipes
                pipe.push({
                    x: canvas.width,
                    y: position - this.pipeUpImage.height
                });

                // adding the new coins
                coins.push({
                    x: canvas.width,
                    y: position - this.pipeUpImage.height
                });

            }

            // collision detection of the bird with the pipes, and the bird with the floor
            if (this.bird.birdX + this.bird.birdWidth >= pipe[i].x &&
                this.bird.birdX <= pipe[i].x + this.pipeUpImage.width &&
                (this.bird.birdY <= pipe[i].y + this.pipeUpImage.height ||
                    this.bird.birdY + this.bird.birdHeight >= pipe[i].y + this.constentGap) ||
                this.bird.birdY + this.bird.birdHeight >= canvas.height - this.floor.floorImage.height) {

                flappyHit.play(); // playing hit sound effect
                lifes--; // decrementing the number of lifes
                this.reset(); // resetting the criterias the pipes and coins
                this.bird.reset(); // resetting the position of the bird
            }

            else {
                this.collectingCoins(i); // collecting coins
            }
        }

        // moving the coins in parallel with the movement of their pipe
        for (var i = 0; i < coins.length; i++) {

            coins[i].x--; // moving the coins towards the bird
            if (this.collected === true) {
                coins.splice(i, 1); // removing collected coins
                this.collected = false;
            }
        }
    }

    // handling collection of the coins and power ups
    collectingCoins(index) {

        // collecting the coins and power ups
        if (pipe[index].x === 25) {

            // collecting the smaller bird power up
            if (score === 5) {
                powerUpSmall = true; // changing state of the power up
                smallerBird.play(); // playing smaller bird sound effect
            }

            // collecting the wider pipes power up
            else if (score === 10) {
                powerUpWide = true;
                widerPipes.play(); // playing wider pipes sound effect
            }

            // collecting the double coins power up
            else if (score === 15) {
                bonus = true; // changing state of the power up
                doubleCoins.play(); // playing double coins sound effect
            }

            // collecting the low gravity power up
            else if (score === 25) {
                powerUpGravity = true; // changing state of the power up
                lowGravity.play(); // playing low gravity sound effect
            }

            // if double coins is activated double the score of the coins
            if (bonus) {
                score += 2;
            }

            else {
                score++; // increment the score
            }

            flappyCoin.play(); // playing coins sound effect
            this.collected = true; // changing the state of the collected coin
        }
    }

    // resetting the coins and pipes arrays 
    reset() {
        pipe = [];
        coins = [];

        pipe[0] = {
            x: canvas.width,
            y: 0,
        };

        coins[0] = {
            x: canvas.width,
            y: 0,
        };
    }
}

// Bird class of the game
class Bird {
    constructor() {
        this.birdX = 10; // x position of the bird
        this.birdY = 150; // y position of the bird
        this.birdHeight = 26; // bird height
        this.birdWidth = 35; // bird width
        this.birdImage = new Image(); // bird image object
        this.birdReady = false;
        this.birdImage.src = "spriteSheets/flappyAnimation.png";
        this.birdImage.onload = () => {
            this.birdReady = true;
        }

        this.gravity = 1.5; // gravity of the game

        this.frameX = 0; // x axis frame of the bird sprite sheet
        this.frameY = 0; // y axis frame of the bird sprite sheet
        this.frameWidth = 35; // width of the frame
        this.frameHeight = 26; // height of the frame
        this.frameTimer = 0; // timer of the frames to be shown
    }


    // draw function of the class
    draw(ctx) {
        if (this.birdReady) {

            // drawing the smaller bird when the corresponding power up is activated
            if (powerUpSmall) {
                this.birdImage.src = "spriteSheets/redFlappy.png";
                this.birdHeight = 22; // changing the bird height
                this.birdWidth = 30; // changing the bird width
            }

            else {
                this.birdHeight = 26; // changing the bird height to initial state
                this.birdWidth = 35; // changing the bird width to initial state

                /* Changing the color of the bird when the corresponding power up is ativated
                 * Blue: for gravity
                 * Green: for pipes
                 * 
                 * else display regular animation
                */
                if (powerUpWide) {
                    this.birdImage.src = "spriteSheets/greenFlappy.png";
                }
                else if (powerUpGravity) {
                    this.birdImage.src = "spriteSheets/blueFlappy.png";
                }
                else {
                    this.birdImage.src = "spriteSheets/flappyAnimation.png";
                }
            }

            // showing the first frame of the bird sprite sheet
            if (this.frameTimer <= 15) {
                this.frameX = 0;
            }

            // showing the second frame of the bird sprite sheet
            else if (this.frameTimer <= 30) {
                this.frameX = 35;
            }

            // showing the third frame of the bird sprite sheet
            else if (this.frameTimer <= 45) {
                this.frameX = 70;
            }

            // drawing the sprite sheet of the bird
            ctx.drawImage(this.birdImage, this.frameX, this.frameY, this.frameWidth, this.frameHeight, this.birdX, this.birdY,
                this.birdWidth, this.birdHeight);
        }

        /* Highlighting the score when the double coins bonus is activated*/
        if (bonus) {
            ctx.fillStyle = "yellow";
            ctx.fillText("Coins : " + score + " 2X", 10, 20);
        }
        else {
            ctx.fillText("Coins : " + score, 10, 20);
        }

        /* Drawing levels and lifes of the player */
        ctx.fillStyle = "white";
        ctx.fillText("Level : " + level, 120, 20);
        ctx.font = "16px Helvetica";
        ctx.fillText("lifes : " + lifes, 220, 20);
    }

    // update function of the class
    update() {

        this.birdY += this.gravity; // decrementing the y position of the bird because of the gravity

        // incrementing the y position of the bird after the space bar is pressed
        // preventing the bird from going outside the canvas
        if (this.birdY >= 0) {
            if (32 in keysdown) {
                this.birdY -= 20;
                flying.play();
                keysdown = [];
            }
        }

        this.frameTimer++; // incrementing the timer of the frames
        if (this.frameTimer >= 45) {
            this.frameTimer = 0; // resetting the frame timer to 0
        }

        // changing the gravity when the low gravity power up is activated
        if (powerUpGravity) {
            this.gravity = 0.5;
        }

        // changing the gravity when the player reaches level 3
        else if (level === 3) {
            this.gravity = 2.0;
        }

        else {
            this.gravity = 1.5; // initial value of the gravity
        }
    }

    // resetting the position of the bird
    reset() {
        this.birdX = 10;
        this.birdY = 150;
    }
}

var game = new Game(); // creating the game object 
var background = new Background(); // creating the background object
var floor = new Floor(); // creating the floor object
var bird = new Bird(); // creating the bird object
var pipes = new Pipes(bird, floor); // creating the pipes object

game.addSprite(background); // adding the background object to the sprites array
game.addSprite(pipes); // adding the pipes object to the sprites array
game.addSprite(floor); // adding the floor object to the sprites array
game.addSprite(bird); // adding the bird object to the sprites array


// displaying the convient menu based on the environment chosen by the user
function displayMenu(enviroment, menu1, menu2) {
    if (enviroment) {
        mainMenu.src = menu1;
    }
    else {
        mainMenu.src = menu2;
    }
}

// resetting the game criterias
function gameReset() {
    pipes.reset(); // resetting the pipes and coins
    bird.reset(); // resetting the bird position
    score = 0; // resetting the score
    lifes = 3; // resetting the number of lifes

    /* Resetting the power ups of the game along with their timer */
    powerUpGravity = false;
    powerUpSmall = false;
    powerUpWide = false;
    bonus = false;
    powerUpTimer = 0;

    /* Resetting the user choices along with the evnironment */
    choice = false;
    choice2 = false;
    day = false;
}

// game engine
var main = function () {

    // displaying menu
    menu(ctx);

    // checking if player chose his option
    if (choice === false) {
        // taking input from the mouse
        addEventListener("click", options, false);
    }

    else {
        mainMenu.src = "assets/menu2.png";
        // taking input from the mouse
        addEventListener("click", options2, false);
    }

    // launching game
    if (choice === true && choice2 === true) {
        game.draw();
        game.update();


        /* When the player looses play dead sound effect and display loosing menu */
        if (lifes === 0) {
            flappyDead.play();
            displayMenu(day, "assets/lost.png", "assets/nightLost.png");
            gameReset(); // reset the game criterias
        }

        /* When the player wins the level play, display winning menu and increment the level*/
        else if (score >= 30 && level != 3) {
            flappyWon.play();
            displayMenu(day, "assets/won.png", "assets/nightWon.png");
            level++;
            gameReset(); // reset the game criterias
        }

        /* When the player finishes level display game finished menu */
        else if (score >= 30 && level === 3) {
            flappyWon.play();
            displayMenu(day, "assets/complete.png", "assets/nightComplete.png");
            level = 1; // reset level to 1
            gameReset(); // reset game criterias
        }
    }

    // Game loop keeps repeating until the user chooses to end the game
    if (endGame != true) {
        requestAnimationFrame(main);
    }
}

requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
main();