//Load boards from file o manually

const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Create variables

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {
    //Run startgame when button is clicked
    id("start-btn").addEventListener("click", startGame);
    //Add event listener to each number in number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            //if selecting is not disabled
            if (!disableSelect) {
                //if number is already selected
                if (this.classList.contains("selected")) {
                    //then remove selections
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //deselect all other number
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //select it and update selectedNum variable
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });

    }

}

function startGame() {
    //choose board difficulty
    let board;
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];

    //set lives to 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: " + lives;
    //Create board basd on difficulty

    generateBoard(board);
    //strats the timer
    startTimer();
    // set themes based on input
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }

    //show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    //sets time remaining based on input
    if (id("time-1").checked) timeRemaining = 120;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 480;
    //Sets timer for first second
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function () {
        timeRemaining--;
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}

function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    //clear previous board
    clearPrevious();
    //Let used to incrementtile ids
    let idCount = 0;
    //Create 81 tiles
    for (let i = 0; i < 81; i++) {
        //Create a new paragraph element
        let tile = document.createElement("p");
        if (board.charAt(i) != "-") {
            //settile text to correct number
            tile.textContent = board.charAt(i);
        } else {
            //Add click event listener to tile
            tile.addEventListener("click", function () {
                //if selecting is not disabled
                if (!disableSelect) {
                    //if the tile is already selected
                    if (tile.classList.contains("selected")) {
                        //then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();

                    }
                }
            });
        }
        //Assign tile id
        tile.id = idCount;

        idCount++;

        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }

        //Add tile to board
        id("board").appendChild(tile);
    }

}

function updateMove(){
    //If a tile and a number is selected
    if(selectedTile && selectedNum){
        // Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution key
        if(checkCorrect(selectedTile)){
            //Deselects the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear the selected variables
            selectedNum = null;
            selectedTile = null;
            //Check if board is complete
            if(checkDone()) {
                endGame();
            }
            //If the number does not match the solution key
        }else {
            //Disable selecting new numbers for one second
            disableSelect = true;
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function(){
                //Subtract lives by 1
                lives--;
                //If no lives left end the game
                if(lives === 0) {
                    endGame();
                }else{
                    //If lives is not equal to zero
                    //Update lives text
                    id("lives").textContent = "Lives Remaining :" + lives;
                    //Enable selecting numbers and tiles
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
                
            }, 1000);
        }
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for(let i = 0;i < tiles.length;i++){
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    //Disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);
    //Display win or loss message
    if(lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost!";
    } else {
        id("lives").textContent = "You Won!";
    }
}

function checkCorrect(tile){
    //set solution based on difficulty selection
    let solution;
    if (id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];
    //if tile's number is equal to solution's number
    if(solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}

function clearPrevious() {
    //access all of the tiles
    let tiles = qsa(".tile");
    //remove each tiles
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    //if there is a timer clean it
    if (timer) clearTimeout(timer);

    //Deselect any number
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    //clear selected variables
    selectedTile = null;
    selectedNum = null;
}


//Helper Function
function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}