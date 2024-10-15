const GameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
    return board;
  }

  function placeMarker(index, marker) {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  }

  function resetBoard() {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  }

  function isFull() {
    return board.every((cell) => cell !== "");
  }

  return {
    getBoard,
    placeMarker,
    resetBoard,
    isFull,
  };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = {
  player1: null,
  player2: null,
  currentPlayer: null,
  message: document.querySelector(".msg"),

  winCombinations: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ],

  startGame(name1, name2) {
    this.player1 = Player(name1, "X");
    this.player2 = Player(name2, "O");
    this.currentPlayer = this.player1;
    GameBoard.resetBoard();
    this.message.textContent = `${this.currentPlayer.name}'s turn!`;
    this.displayBoard();
  },

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
    this.message.textContent = `${this.currentPlayer.name}'s turn!`;
  },

  checkWin() {
    const board = GameBoard.getBoard();
    return this.winCombinations.some((combination) =>
      combination.every((index) => board[index] === this.currentPlayer.marker)
    );
  },

  checkTie() {
    return GameBoard.isFull() && !this.checkWin();
  },

  playTurn(index) {
    if (GameBoard.placeMarker(index, this.currentPlayer.marker)) {
      this.displayBoard();
      if (this.checkWin()) {
        this.message.textContent = `${this.currentPlayer.name} wins!`;
        DisplayController.removeClickEvents();
        return true;
      }
      if (this.checkTie()) {
        this.message.textContent = `It's a tie!`;
        DisplayController.removeClickEvents();
        return true;
      }
      this.switchPlayer();
    } else {
      this.message.textContent = `Invalid move, spot already taken. ${this.currentPlayer.name}'s turn`;
    }
    return false;
  },

  displayBoard() {
    const board = GameBoard.getBoard();
    const grid = document.querySelector(".grid");
    grid.textContent = "";

    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "grid-item";
      cellDiv.textContent = cell;
      cellDiv.onclick = () => GameController.playTurn(index);
      grid.appendChild(cellDiv);
    });
  },
};

const DisplayController = (function () {
  const form = document.querySelector("#myForm");
  const message = document.querySelector(".msg");
  const player1 = document.querySelector("#player1");
  const player2 = document.querySelector("#player2");
  const grid = document.querySelector(".grid");

  function displayBoard() {
    const board = GameBoard.getBoard();

    board.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "grid-item";
      cellDiv.textContent = cell;
      grid.appendChild(cellDiv);
    });
  }

  function removeClickEvents() {
    const cells = document.querySelectorAll(".grid-item");
    cells.forEach((cell) => {
      cell.onclick = null;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (player1.value == "" || player2.value == "") {
      message.textContent = "Please enter both player names.";
      console.log(message.textContent);
    } else {
      const player1Name = player1.value;
      const player2Name = player2.value;

      GameController.startGame(player1Name, player2Name);
    }
  });

  function initializeResetButton() {
    const resetButton = document.querySelector("#reset-game");
    
    resetButton.onclick = (e) => {
      e.preventDefault();
      GameBoard.resetBoard();
      grid.textContent = "";
      player1.value = "";
      player2.value = "";
      message.textContent = "Enter players name";
      console.log(message.textContent);
      displayBoard();
    };
  }

  return {
    displayBoard,
    removeClickEvents,
    initializeResetButton,
  };
})();

DisplayController.initializeResetButton();
DisplayController.displayBoard();
