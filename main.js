//* create static method on Field to create a random field or a seperate module
//*do prompt functions belong in the class? maybe as module functions assigned to methods. for now they all work outside of it fine so could be a module
//*Is there a way to remove the waiting prompt and display the "here we go text under the new board for example?"
//IMPORTANT After winning or losing one time, if you answer you don't want to play again the game restarts regardless, while showing the previous board. maybe prompt functions must reset the answer again so it's ready for a new prommpt. winning or losing after the bug causes correct behavior
//seems the problem is in resetGame as it happens with a n answer even after removing playAgainPrompt
//possibly it jumps back into the while loop, maybe can fix by turning play game into an object with loop and check methods so they dont run sequentially down
//maybe add a property which is an object containing game functions
//make sure when adding new field that it somehow keeps the first loss status of the previous field. maybe it should just be a global variable
//*change all instances of holes and path etc to the characters, maybe make them properites of Field objects too. That way it's easier to change if i want to in the future
//*Add green and brown for path and grass

//add out of bounds logic


//Need to move input functions to their own module
//Imports necessary modules
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

//Sets game characters
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//Field class used to play the game
class Field {
    constructor(field){
        this._field = field;
        this._playField = Field.createPlayField(field);
    };
    get field(){
        return this._field
    };
    get playField(){
        return this._playField
    };
    set playField(newField){
        this._playField = newField
    };
    firstLoss = false;
    //Creates the play field that will be logged to the console with objective and holes hidden
    //**need to add the property which will be used to print this.playField
    static createPlayField(field){
        let playField = [];
        let rows = field.length;
        let columns = field[0].length;
        for(let i = 0; i < rows; i++){
            let row = []
            for(let i = 0; i < columns; i++){
                row.push('░');
            }
            playField.push(row);
        }
        playField[0][0] = '𓀠';
        return playField
    };
    playGame(){
        let gameOver = false;
        let x = 0;
        let y = 0;
        //This function will check the move for Win/Loss and update the playField appropriately.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this"
        let checkMove = function(){
            if(this.field[y][x]!== "O" && this.field[y][x] !== "^"){
                this.playField[y][x] = "𓀠";
            }else if(this.field[y][x] === "O"){
                this.playField[y][x] = "O";
                gameOver = true;
                lose();
            }else if(this.field[y][x] === "^"){
                this.playField[y][x] = "^";
                gameOver = true;
                win();
            }
        }.bind(this);
        //This function inniciates the loss dialog and displays the final field.
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this"
        //*Add logic to play the same field vs a new field. set field to a new Field (maybe this goes in the play again prompt?)
        let lose = function(){
            console.clear()
            this.printPlayField();
            if(this.firstLoss === false){
                this.firstLoss = true;
                console.log("Oops, you fell in a hole!\nDid I forget to mention that there were holes?\nAlright, that one's on me.")
            }else{
                console.log("Oh you fell in a hole...again.");
            }
            resetGame()
        }.bind(this);
        //This function initiates the loss dialog and displays the final field
        //.bind(this) is used to reference the Field object's "this" rather than the function's "this"
        //*Add logic to play the same field vs a new field
        let win = function(){
            console.clear()
            this.printPlayField();
            console.log("Woah, you did it! You found your hat! To be honest...I didn't see that coming.");
            resetGame()
        }.bind(this)
        //Resets the game and begins again





        let resetGame = function(){
            let answer = playAgainPrompt()
            if(answer === "Y"){
                console.clear();
                gameOver = false;
                x = 0;
                y = 0;
                this.playField = Field.createPlayField(this.field);
                playLoop() 
            }
        }.bind(this)




        //Allows player to move around the board. Changes playField to show path. Includes win and loss logic.
        let playLoop = function(){
                while(!gameOver){
                console.clear();
                this.printPlayField();
                let direction = directionPrompt();
                if(direction === "W"){
                    this.playField[y][x] = "*";
                    y -= 1;
                    checkMove();
                }else if(direction === "A"){
                    this.playField[y][x] = "*";
                    x -= 1;
                    checkMove();
                }else if(direction === "S"){
                    this.playField[y][x] = "*";
                    y += 1;
                    checkMove();
                }else if(direction === "D"){
                    this.playField[y][x] = "*";
                    x += 1;
                    checkMove();
                }
            }
        }.bind(this)    
        //remove after test
        playLoop()   
    };
    //Prints the field that will be displayed with objective and holes hidden
    printPlayField(){
        for(let line of this.playField){
            let string = '';
            for(let space of line){
                string += space;
            }
            console.log(string);
        }
    };
    //Prints the actual field with holes and objective revealed (useful for debugging)
    printField(){
        for(let line of this.field){
            let string = '';
            for(let space of line){
                string += space;
            }
            console.log(string);
        }
    };
};
//This function will prompt the user for a Yes or No answer and return Y or N. 
//This function also clears the console after each answer preparing it for the next dialog.
function yesNoPrompt(){
    let answer = prompt(">");
    if(answer.toUpperCase()==="N"){
        console.clear();
        return "N"
    }else if(answer.toUpperCase()==="Y"){
        console.clear();
        return "Y"
    }else{
        console.clear();
        console.log("Pardon me. I'm not very smart, and  I don't understand. Please enter Y for yes and N for no.");
        return yesNoPrompt();
    }
};









//*Perhaps add the new field option here
function playAgainPrompt(){
    console.log("Would you like to start over?")
    let answer = yesNoPrompt();
    if(answer === "Y"){
        console.log("You just made me so happy! Are you ready?")
        answer = yesNoPrompt();
        if(answer === "Y"){
            return "Y"
        }else if(answer === "N"){
            waitingPrompt()
        }
    }else if(answer === "N"){
        console.log("I'm really sorry to hear that. I'm going to miss you. Goodbye.");
    }
};



function waitingPrompt(){
    console.log("Oh, okay, I guess I'll wait. Just don't forget about me...Are you ready now?")
    let answer = yesNoPrompt();
    if(answer === "Y"){
        field.playGame()
    }else if(answer === "N"){
        waitingPrompt()
    }
}








//This function will prompt the user for direction input and returns it. If input is invalid it will ask again.
function directionPrompt(){
    let direction = prompt(">");
    if(direction.toUpperCase()==="W"){
        return "W"
    }else if(direction.toUpperCase()==="A"){
        return "A"
    }else if(direction.toUpperCase()==="S"){
        return "S"
    }else if(direction.toUpperCase()==="D"){
        return "D"
    }else{
        console.clear()
        field.printPlayField()
        console.log("It really is important that you eneter either W, A, S, or D, otherwise I just can't help you!")
        return directionPrompt()
    }
};








//Asks user if they would like to play and begins the game if so
function introDialog(){
    console.clear()
    console.log("Would you like to play a game?");
    let answer = yesNoPrompt();
    if(answer === "N"){
        console.log("I'm sorry to hear that. Goodbye.");
    }else if(answer === "Y"){
        console.log(
`That's great to hear, I'm excited for your!
Thankfully the tornado missed your home town, 
but the winds were still strong, and you lost your hat!
I'm sure it's somewhere in that field over there though! 
You can use W, A, S, D to move around and look for it.  Good luck!
Are you ready?`
        );
        answer = yesNoPrompt();
        if(answer === "N"){
            waitingPrompt()
        }else if(answer === "Y"){
            field.playGame();
        }
    }
};










//**eventually add array made with generate field module rather than a predefined array
//**Add logic for the end. Would you like to play again? Which then generates a new field and assigns it to field
let field = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);

// introDialog();
field.playGame()
// field.printDisplayField()
// field.createDisplayField()
// field.printHiddenField()
// field.createDisplayField()
// console.log(field.displayField)
//introDialog()


// readline.clearLine(process.stdout);
// readline.cursorTo(process.stdout, 0);