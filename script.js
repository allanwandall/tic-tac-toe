


const gameBoard = (() => {
    let _board = new Array(9);

    const getField = (idx) => {
        return _board[idx];
    }

    const setField = (player, idx) => {
        const domField = document.querySelector(`.game-grid:nth-child(${idx + 1})`);
        player.textContent = player.getSign();
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
    const _humanPlayer = Player("X");
    const _computerPlayer = Player("O");

    //checks row win conditions
    const _checkRows = (board) => {
        for (let i = 0; i <= 6; i += 3){
            if (board[i] == board[i + 1] && board[i] == board[i + 2]) {
                return true;
            }
        }
        return false;
    }

    //check column win conditions
    const _checkColumns = (board) => {
        for (let i = 0; i <= 2; i++){
            if (board[i] == board[i + 3] && board[i] == board[i + 6]) {
                return true;
            }
        }
        return false;
    }

    //check diagonal win conditions
    const _checkDiagonals = (board) => {
        if (board[0] == board[4] && board[0] == board[8]) {
            return true;
        } else if (board[2] == board[4] && board[2] == board[6]) {
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
        for (let i = 0; i < board.length; i++){
            if (board[i] == undefined) {
                return false;
            }
        }
        return true;
    }

    // changes the sign of player object
    const changeSign = (sign) => {
        if (sign === "O") {
            _humanPlayer.setSign = "O";
            _computerPlayer.setSign = "X";
        } else if (sign === "X") {
            _humanPlayer.setSign = "X";
            _computerPlayer.setSign = "O";
        } else throw 'Invalid sign';
    }

    const playerMove = (idx) => {
        const field = gameBoard.getField(idx);

        if (field == undefined) {
            gameBoard.setField(_humanPlayer, idx);
            if (_checkWin(gameBoard)) {
                _endGame(_humanPlayer.getSign());
            }
        }
    }


})();

const displayController = (() => {

    let _round = 1;

    const _changeRound = () => {
        const roundTitle = document.querySelector(".round");
        _round++;
        roundTitle.textContent = `Round: ${_round}`;
    }

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

    const signContainer = document.querySelector(".sign-container");
    const gameContainer = document.querySelector(".game-container");
    const returnBtn = document.getElementById("return-button");
    const oBtn = document.getElementById("o-button");
    oBtn.addEventListener("click", _toggleWindows, false);
    returnBtn.addEventListener("click", _toggleWindows, false);
})();