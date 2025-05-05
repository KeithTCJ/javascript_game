const prompt = require("prompt-sync")();

//Break down what you need in the game 
 // (generate initial grass field, generate hat, holes and icon, clear and move player position, how player interacts with boundaries, hole and hat)

// Constant Game Elements
const HAT = '^';
const HOLE = 'O';
const GRASS = '░';
const PLAYER = '*';

// Constants Game Scenarios (Messages)
const WIN = "Congratulations! You win!";                                    /* WIN */
const LOSE = "You lose!";                                                   /* LOSE */
const OUT_BOUND = "You are out of the field.";                              /* OUT OF BOUNDS */
const INTO_HOLE = "You fell into a hole";                                   /* FALLEN INTO HOLE */
const WELCOME = "Welcome to Find Your Hat game";                            /* START OF GAME WELCOME MESSAGE */
const DIRECTION = "Which direction, up(w), down(s), left(a) or right(d)?";  /* KEYBOARD DIRECTIONS */
const QUIT = "Press q or Q to quit the game.";                              /* KEYBOARD TO QUIT THE GAME */
const END_GAME = "Game Ended. Thank you.";                                  /* ENDED THE GAME */
const NOT_RECOGNISED = "Input not recognised.";                             /* INPUT NOT RECOGNISED */

class Field {
  
    // constructor
    constructor(rows, cols){
        this.rows = rows;                           /* property to set up the number of rows for the field */
        this.cols = cols;                           /* property to set up the number of cols for the field */
        this.field = new Array([]);                 /* property that represents the field for game */
        this.gamePlay = false;                      /* property to setup the game play */
        this.playerPos = {x: 0, y: 0};             /* track player position */
        this.hatPos = null;                         /* track hat position */
    }

    // methods

    // Welcome Message
    static welcomeMsg(msg){
        console.log(
            "\n**********************************************\n" +
            msg
            + "\n**********************************************\n"
        );
    }


    // Generate the game's field
    generateField(){
        // Generate empty field with grass
        for (let i = 0; i < this.rows; i++) {
            this.field[i] = new Array();
            for (let j = 0; j < this.cols; j++) {
                this.field[i][j] = GRASS;
            }
        }

        // Place hat at random position (not at start)
        do {
            this.hatPos = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.hatPos.x === 0 && this.hatPos.y === 0);
        this.field[this.hatPos.y][this.hatPos.x] = HAT;  // if hat is at [0][0], do the loop again.

        // Place holes (about 20% of the field)
        const holeCount = Math.floor(this.rows * this.cols * 0.2);
        for (let i = 0; i < holeCount; i++) {
            let holeX, holeY;  // declaring empty variables
            do {
                holeX = Math.floor(Math.random() * this.cols);
                holeY = Math.floor(Math.random() * this.rows);
            } while (
                (holeX === 0 && holeY === 0) || // Not at start position
                (holeX === this.hatPos.x && holeY === this.hatPos.y) || // Not on hat
                this.field[holeY][holeX] === HOLE // Not on existing hole
            );
            this.field[holeY][holeX] = HOLE;
        }

        // Place player at start
        this.field[0][0] = PLAYER;
        this.playerPos = {x: 0, y: 0};
    } 

    // Print out the game field
    printField(){
        this.field.forEach((element) => {
            console.log(element.join(""));
        });
    }

    // Start game
    startGame(){
        this.gamePlay = true;
        this.generateField(this.rows, this.cols);
        this.printField();
        this.updateGame();
    }

    // Update game
    updateGame(){
        let userInput = "";
        
        do {
            console.log(DIRECTION.concat(" ", QUIT));
            userInput = prompt();
            
            switch (userInput.toLowerCase()) {
                case "w":
                case "s":
                case "a":
                case "d":
                    this.updatePlayer(userInput.toLowerCase());
                    break;
                case "q":
                    this.endGame();
                    break;
                default:
                    console.log(NOT_RECOGNISED);
                    break;
            }            
            
            this.printField();
            
        } while (userInput.toLowerCase() !== "q" && this.gamePlay);
    }

    // End game
    endGame(){
        console.log(END_GAME);
        this.gamePlay = false;
        process.exit();
    }

    // Update the player's movement and game condition
    updatePlayer(direction){
        // Clear current player position
        this.field[this.playerPos.y][this.playerPos.x] = GRASS;
        
        // Calculate new position
        let newX = this.playerPos.x;
        let newY = this.playerPos.y;
        
        switch(direction) {
            case 'w': newY--; break;
            case 's': newY++; break;
            case 'a': newX--; break;
            case 'd': newX++; break;
        }
        
        // Check boundaries
        if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {  //if player position hits coordinates that are less than 0 or more than array length = out of bounds
            console.log(OUT_BOUND);
            console.log(LOSE);
            this.endGame();
            return;
        }
        
        // Check for hole
        if (this.field[newY][newX] === HOLE) {  // if player hits hole
            console.log(INTO_HOLE);
            console.log(LOSE);
            this.endGame();
            return;
        }
        
        // Check for hat
        if (this.field[newY][newX] === HAT) {  //if player finds hat
            console.log(WIN);
            this.endGame();
            return;
        }
        
        // Update player position
        this.playerPos.x = newX;
        this.playerPos.y = newY;
        this.field[newY][newX] = PLAYER;
    }
}

// Static method to welcome the player
Field.welcomeMsg(WELCOME);

const ROWS = 10;
const COLS = 10;
const field = new Field(ROWS, COLS);
field.startGame();