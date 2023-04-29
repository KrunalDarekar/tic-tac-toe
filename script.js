const gameBoard = (() => {
    const board = ["","","","","","","","",""];

    const getBoard = () => board;

    const addMark = (player, index) => {
        if (board[index]) return;
        board[index] = player.getToken();
    }
    
    return {getBoard, addMark};
})();

const Player = (name, token) => {
    const getToken = () => token;
    const getName = () => name;
    return {getToken, getName};
};

const GameController = (() => {
    const board = GameBoard.getBoard();
    const player1 = Player("player X", "X");
    const player2 = Player("player O", "O");

    let activePlayer = player1;

    let gameOver = false;
    let winner;
    const winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

    const checkForWin = (gameBoard) => {
        winningCombinations.forEach((combination) => {
            if (gameBoard[combination[0]] === board[combination[1]] === board[combination[2]]) {
                gameOver = true;
                winner = activePlayer;
            }
        })
    }

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    const getActivePlayer = () => activePlayer;

    const getWinner = () => winner;

    const getGameStatus = () => gameOver;

    return { getActivePlayer, switchPlayerTurn, checkForWin, getWinner, getGameStatus};
})();

const DisplayController = (() => {
    const board = GameBoard.getBoard();
    const boardContainer = document.querySelector(".container");
    const topMessage = document.querySelector(".top-message");

    const displayPlayerTurn = () => {
        const player = GameController.getActivePlayer();
        topMessage.innerHTML = `${player.getName()}'s turn`;
    }

    const displayWinner = () => {
        const winner = GameController.getWinner();
        topMessage.innerHTML = `${winner.getName()} is the winner`;
    }

    const displayBoard = () => {
        boardContainer.textContent = "";
        displayPlayerTurn();
        let index = 0;
        board.forEach( () => {
            const cellButton = document.createElement("button");
            cellButton.innerHTML = `${board[index]}`
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            cellButton.addEventListener("click", () => {
                GameController.addMark(GameController.getActivePlayer(), parseInt(cellButton.dataset.index, 10))
                GameController.checkForWin(board);
                if (GameController.getGameStatus()) {
                    displayWinner();
                }
                GameController.switchPlayerTurn();
                displayBoard();
            })
            boardContainer.appendChild(cellButton);
            index += 1;
        });
    }

    return {displayBoard};
})();

DisplayController.displayBoard();