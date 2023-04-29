const gameBoard = (() => {
    const board = ["","","","","","","","",""];

    const getBoard = () => board;

    const addMark = (player, index) => {
        board[index] = player.getToken();
    }
    
    return { getBoard, addMark};
})();

const Player = (name, token) => {
    const getToken = () => token;
    const getName = () => name;

    return { getToken, getName};
};

const gameController = (() => {
    const board = gameBoard.getBoard();
    const player1 = Player("player X", "X");
    const player2 = Player("player O", "O");

    let activePlayer = player1;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    const getActivePlayer = () => activePlayer;

    let gameResult = "";
    let isOver = false;
    const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    const checkForGameOver = (index) => {
        winningCombinations.forEach( (combination) => {
            if (board[combination[0]] && board[combination[0]] === board[combination[1]] && board[combination[2]] === board[combination[1]]) {
                gameResult = `${activePlayer.getName()} is the winner`;
                isOver = true;
                
            }
        })
        
        if (!gameResult) {
            let count = 0;
            board.forEach( (cellValue) => {
                if (cellValue) {
                    count += 1;
                }
            });
            if (count === 9) {
                isOver = true;
                gameResult = "It's a tie";
            }
        }
    }

    const getGameResult = () => gameResult;
    const getGameIsOver = () => isOver;
    
    const playRound = (index) => {
        if (board[index]) return;
        gameBoard.addMark(activePlayer, index);

        checkForGameOver(index);

        switchPlayerTurn();
    }

    const getCurrentBoard = () => board;

    return { getActivePlayer, playRound, getCurrentBoard, getGameIsOver, getGameResult};
})();

const displayController = (() => {
    const board = gameController.getCurrentBoard();
    const boardContainer = document.querySelector(".container");
    const topMessage = document.querySelector(".top-message");

    const displayPlayerTurn = () => {
        const player = gameController.getActivePlayer();
        topMessage.innerHTML = `${player.getName()}'s turn`;
    }

    const displayGameOverMessage = () => {
        const message = gameController.getGameResult();
        topMessage.innerHTML = `${message}`;
    }

    const updateDisplay = () => {
        if (gameController.getGameIsOver()){
            displayGameOverMessage();
        } else {
            displayPlayerTurn();
        }
        boardContainer.textContent = "";
        let index = 0;
        board.forEach( () => {
            const cellButton = document.createElement("button");
            cellButton.innerHTML = `${board[index]}`
            cellButton.classList.add("cell");
            if (board[index]) cellButton.classList.add(`${board[index]}`);
            cellButton.dataset.index = index;
            boardContainer.appendChild(cellButton);
            index += 1;
        });
    }

    function clickHandlerBoard(e) {
        if (gameController.getGameIsOver()) return;
        const selectedCellIndex = e.target.dataset.index;
        if (!selectedCellIndex) return;

        gameController.playRound(selectedCellIndex);
        updateDisplay();
    }

    boardContainer.addEventListener("click", clickHandlerBoard);

    return { updateDisplay};
})();

displayController.updateDisplay();