const prompt = require("prompt-sync")();

// Game elements
const GRASS = "░";
const HOLE = "0";
const HAT = "^";
const PLAYER = "*";

const rows = 20;
const cols = 20;

const field = [];               // Create an array for the game field

/* 
Populate the game field as a 2D-array - using Math.random() 
via nested loops.
Note: By default, Math.random() generates random numbers ranging from 0 - 0.9999...
*/

for(let i=0; i<rows; i++){
    field[i] = [];                 // same as field = new Array();
    for (let j=0; j<cols; j++){ // nested for loop used to populate the columns in each field's row
        field[i][j] = Math.random() > 0.2 ? GRASS : HOLE;  // ternary operation to randomise the field with holes, if Math.random() hits any value that is >0.2, fill that part with GRASS if not, fill with HOLE

    }
}

field[0][0] = PLAYER;               // Populate PLAYER at start of game

for (let row of field){             // Join each element together per role
    console.log(row.join(""));
}