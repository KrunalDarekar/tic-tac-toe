const gameBoard = (() => {
    const board = ["","","","","","","","",""];

    const getBoard = () => board;

    const addMark = (player, index) => {
        if (board[index]) return;
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

    const playRound = (index) => {
        gameBoard.addMark(activePlayer, index);

        // game-logic

        switchPlayerTurn();
    }

    const getCurrentBoard = () => board;

    return { getActivePlayer, playRound, getCurrentBoard};
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
        const winner = gameController.getActivePlayer();
        topMessage.innerHTML = `${winner.getName()} is the winner`;
    }

    const updateDisplay = () => {
        boardContainer.textContent = "";
        displayPlayerTurn();
        let index = 0;
        board.forEach( () => {
            const cellButton = document.createElement("button");
            cellButton.innerHTML = `${board[index]}`
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            boardContainer.appendChild(cellButton);
            index += 1;
        });
    }

    function clickHandlerBoard(e) {
        const selectedCellIndex = e.target.dataset.index;
        if(!selectedCellIndex) return;

        gameController.playRound(selectedCellIndex);
        updateDisplay();
    }

    boardContainer.addEventListener("click", clickHandlerBoard);

    return { updateDisplay};
})();

displayController.updateDisplay();