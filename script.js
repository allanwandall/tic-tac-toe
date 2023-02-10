

//The gameBoard module had the main function of managing an array which represents the game fields
const gameBoard = (() => {
    let _board = new Array(9);

    const getField = (idx) => {
        return _board[idx];
    }

    const setField = (player, idx) => {
        const domField = document.querySelector(`.game-grid div:nth-child(${idx + 1})`);
        domField.textContent = player.getSign();
        _board[idx] = player.getSign();
    }

    const clear = () => {
        for (let i = 0; i < _board.length; i++){
            _board[i] = undefined;
        }
    }

    return {
        getField,
        setField,
        clear
    }
})();


const Player = (sign) => {
    let _sign = sign;

    const getSign = () => _sign;

    const setSign = (sign) => {
        _sign = sign;
    }

    return {
        getSign,
        setSign
    }
} 

const gameController = (() => {
    const _humanPlayer = Player("");
    const _computerPlayer = Player("");

    //checks row win conditions
    const _checkRows = (board) => {
        for (let i = 0; i <= 6; i += 3){
            if (board.getField(i) == board.getField(i + 1) && board.getField(i) == board.getField(i + 2) && board.getField(i) !== undefined) {
                return true;
            }
        }
        return false;
    }

    //check column win conditions
    const _checkColumns = (board) => {
        for (let i = 0; i <= 2; i++){
            if (board.getField(i) == board.getField(i + 3) && board.getField(i) == board.getField(i + 6) && board.getField(i) !== undefined) {
                return true;
            }
        }
        return false;
    }

    //check diagonal win conditions
    const _checkDiagonals = (board) => {
        if (board.getField(0) == board.getField(4) && board.getField(0) == board.getField(8) && board.getField(0) !== undefined) {
            return true;
        } else if (board.getField(2) == board.getField(4) && board.getField(2) == board.getField(6) && board.getField(2) !== undefined) {
            return true;
        }
        return false;
    }

    //evaluates if the board met a win conditions, in which case it return true
    const _checkWin = (board) => {
        if (_checkRows(board) || _checkColumns(board) || _checkDiagonals(board)){
            return true;
        }
        return false;
    }

    //checks is the board is full and there is a draw
    const _checkDraw = (board) => {
        for (let i = 0; i < 9; i++){
            if (board.getField(i) == undefined) {
                return false;
            }
        }
        return true;
    }

    // changes the sign of player object
    const changeSign = (sign) => {
        if (sign == "O") {
            console.log("OH");
            _humanPlayer.setSign("O");
            _computerPlayer.setSign("X");
        } else if (sign == "X") {
            console.log("EKS");
            _humanPlayer.setSign("X");
            _computerPlayer.setSign("O");

            //O moves first
            _computerDelay(1000, 2000);

        } else throw 'Invalid sign';
    }

    //Evaluates if the chosen field is available and then checks win conditions.
    const playerMove = (idx) => {
        const field = gameBoard.getField(idx);

        if (field == undefined) {
            gameBoard.setField(_humanPlayer, idx);
            
            if (_checkWin(gameBoard)) {
                _endGame(_humanPlayer.getSign());
            } else if (_checkDraw(gameBoard)) {
                _endGame("Draw");
            } else {
                _computerDelay(1000, 3000);
            }
        } else {
            console.log("filled");
        }       
    }

    const _endGame = (sign) => {
        console.log(`Game ended. Result is: ${sign}`);
        if (sign == _humanPlayer.getSign()) {
            displayController.endGame("Player");
        } else if (sign == _computerPlayer.getSign()) {
            displayController.endGame("Computer");
        } else {
            displayController.endGame();
        }
        
    }

    const _sleep = (delayInms) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
    }

    //Delay function for further development
    const _computerDelay = (min, max) => {
        displayController.deactivate();
        displayController.changeTurn();
        (async () => {

            // Delay in milliseconds - a random number between min and max
            const _delay = Math.floor(min + (Math.random() * (max - min)));
            console.log(_delay);
            await _sleep(_delay);
            _computerMove(gameBoard);
        })();
        
    }

    //Computer chooses a random available field 
    const _computerMove = () => {
        let invalidField = true;
        let rdmField;

        while (invalidField) {
            rdmField = Math.floor(Math.random() * 9);
            if (gameBoard.getField(rdmField) == undefined) {
                invalidField = false;
            }
        }
        
        gameBoard.setField(_computerPlayer, rdmField);
        displayController.activate();

        if (_checkWin(gameBoard)) {
            _endGame(_computerPlayer.getSign());
        } else if (_checkDraw(gameBoard)) {
            _endGame("Draw");
        }

        displayController.changeTurn();
    }

    return {
        changeSign,
        playerMove
    }

})();

const displayController = (() => {

    let _round = 1;
    let _playerWins = 0;
    let _computerWins = 0;

    const _allHtmlFields = Array.from(document.querySelectorAll(".grid-square"));
    const signContainer = document.querySelector(".sign-container");
    const gameContainer = document.querySelector(".game-container");
    const returnBtn = document.getElementById("return-button");
    const oBtn = document.getElementById("o-button");
    const xBtn = document.getElementById("x-button");
    const playerTurn = document.getElementById("player-turn");
    const computerTurn = document.getElementById("computer-turn");

    //adds one to the round number and updates the display
    const _changeRound = () => {
        const roundTitle = document.querySelector(".round");
        _round++;
        roundTitle.textContent = `Round ${_round}`;
    }

    const _resetRound = () => {
        _round = 1;
        const roundTitle = document.querySelector(".round");
        roundTitle.textContent = "Round 1";
    }

    //toggles between the game and sign container showing on the screen
    const _toggleWindows = () => {
        console.log("entered toggleWindows");
        if (!signContainer.classList.contains("hide")) {
            signContainer.classList.add("hide");

            setTimeout(() => {
                gameContainer.classList.add("show");
                returnBtn.classList.add("show");
            }, "500");
        } else {
            gameContainer.classList.remove("show");
            returnBtn.classList.remove("show");
            signContainer.classList.remove("hide");
        }
    }

    const deactivate = () => {
        _allHtmlFields.forEach(field => {
            field.classList.add("disabled");
        });
    }

    const activate = () => {
        _allHtmlFields.forEach(field => {
            field.classList.remove("disabled");
        })
    }

    //add event listeners all the fields and buttons so they can be pressed to trigger a response
    const _initFields = (() => {

        for (let i = 0; i < _allHtmlFields.length; i++) {
            _allHtmlFields[i].addEventListener("click", () => {
                gameController.playerMove(i);
            });
        }

        oBtn.addEventListener("click", () => {
            console.log("pressed O button");
            _toggleWindows();
            gameController.changeSign("O");
        }, false);

        xBtn.addEventListener("click", () => {
            _toggleWindows();
            gameController.changeSign("X");
        }, false);

        returnBtn.addEventListener("click", () => {
            _toggleWindows();
            _clear();
            gameBoard.clear();
        }, false);

    })();

    //changes the visuals of the top bar to indicates whose turn it is
    const changeTurn = () => {
        console.log("changeTurn");
        if (playerTurn.classList.contains("active-turn")) {
            playerTurn.classList.remove("active-turn");
            computerTurn.classList.add("active-turn");
        } else if (computerTurn.classList.contains("active-turn")) {
            playerTurn.classList.add("active-turn");
            computerTurn.classList.remove("active-turn");
        }
    }
    
    //removes all X and O from the fields
    const _clear = () => {
        _resetRound();
        _allHtmlFields.forEach(field => {
            field.textContent = ""; 
        });
    }

    //handles visuals at the end of the game 
    const endGame = (win) => {

        if (win == "Player") {
            _playerWins++;
            playerTurn.textContent = `Player: ${_playerWins}`;
        } else if (win == "Computer") {
            _computerWins++;
            computerTurn.textContent = `Computer: ${_computerWins}`;
        }

        _clear();
        _changeRound();
        gameBoard.clear();
    }

    return {
        endGame,
        changeTurn,
        deactivate,
        activate
    }

})();