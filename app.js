document.addEventListener("DOMContentLoaded", function() {

  /*
  * Function: Set up Game State
  */
  const setupBoardState = (gameSize) => {
    let boardState = [];
    boardState = Array.from({ length: gameSize }, _ => Array(gameSize).fill(''));
    console.table(boardState);
    return boardState;
  };

  /*
  * Function: Set up Game Board DOM Elements
  */
  const createBoardElements = (boardState) => {
    var boardSize = boardState.length; // define boardSize
    var board = document.createElement('table');
    board.style.padding = '25px';
    board.onclick = (e) => { handleClick(e) };

    for (let i = 0; i < boardSize; i++) { // Add n rows to board
      let boardRow = document.createElement('tr');
      boardRow.cssText = 'height: 20px';
      board.appendChild(boardRow);
      for (let j = 0; j < boardSize; j++) { // Add n cells to row
        let boardSpace = document.createElement('td');
        boardSpace.innerText = boardState[i][j];
        boardSpace.style.cssText = '\
        padding: 20px; \
        border: 3px solid blanchedalmond;\
        font-family: arial;\
        font-size: auto'; // #teamblanchedalmond
        boardSpace.className += `${i}${j}`;
        boardRow.appendChild(boardSpace);
      }
    }
    return board;
  };

  /*
  *  Handlers
  */

  const handleClick = (e) => {
    let target = e.target;
    if (target.tagName === 'TD' && !gameIsEnded) {
      console.log(target.className);
      let [x, y] = [...target.className].map(x => Number(x));
      if (target.innerText === '') {
        boardState[x][y] = isXTurn ? 'X' : 'O';
        console.log(boardState[x][y]);
        target.innerText = boardState[x][y];
        isXTurn = !isXTurn;
        playsMade++;
        checkForEndGame();
      }
    }
  };

  /*
  * Check for terminal board-state
  */
  const checkForEndGame = () => {
    const victoryStates = ['XXX', 'OOO'];
    for (let i = 0; i < boardState.length; i++) {
      // check upper left diagonal
      if (i === 0) {
        let j = 0;
        let upperDiags = '';
        let upperDiagsCoords = [];
        while (j < boardState.length) {
          upperDiags += boardState[j][j];
          upperDiagsCoords = [...upperDiagsCoords, [j, j]];
          j++;
        }
        if (victoryStates.includes(upperDiags)) {
          endGame(upperDiagsCoords);
          break;
        }
      } else if (i === boardState.length - 1) {
        let k = 2;
        let l = 0;
        let lowerDiags = '';
        let lowerDiagsCoords = [];
        while (k >= 0) {
          lowerDiags += boardState[k][l];
          lowerDiagsCoords = [...lowerDiagsCoords, [k, l]];
          k--;
          l++;
        }
        if (victoryStates.includes(lowerDiags)) {
          endGame(lowerDiagsCoords);
          break;
        }
      }

      // check rows/cols
      for (let i = 0; i < boardState.length; i++) {
        let currentRow = '';
        let currentCol = '';
        let rowCoords = [];
        let colCoords = [];
        for (let j = 0; j < boardState.length; j++) {
          currentRow += boardState[i][j];
          currentCol += boardState[j][i];
          rowCoords = [...rowCoords, [i,j]];
          colCoords = [...colCoords, [j,i]];
        }
        if (victoryStates.includes(currentRow)) {
          endGame(rowCoords);
          break;
        } else if (victoryStates.includes(currentCol)) {
          endGame(colCoords)
          break;
        }

      }
      if (gameIsEnded) {
        break;
      }
      if (playsMade === boardState.length ** 2) {
        console.log('board is full!!!!');
        endGame(null, true);
      }
    }
  };

  /*
  * End the game
  */
  const endGame = (victoryCoords, isDraw) => {
    if (isDraw) {
      isTieGame = true;
    } else {
      victoryCoords.forEach( set => {
        let classCoord = `${set[0]}${set[1]}`;
        let winSpace = document.getElementsByClassName(classCoord)[0];
        winSpace.style.backgroundColor = "red";
      });
    }
    gameIsEnded = true;
    if (isTieGame) {
      document.getElementById('winnerMessage').innerText = "Tie Game!";
    } else {
      document.getElementById('winnerMessage').innerText = !isXTurn ? "X wins!" : "O wins!";
    }
  };

  /*
  * Refresh board
  */
  const refreshBoard = () => {
    boardElement = createBoardElements(boardState);
    renderGame(boardElement);
  };

  /*
  * Reset board
  */
  const resetBoard = () => {
    boardState = setupBoardState(gameSize);
    setInitialState();
    renderGame(boardElement);
  };

  const setInitialState = () => {
    clearBoard();
    playsMade = 0;
    isXTurn = true;
    gameIsEnded = false;
    isTieGame = false;
  };

  const clearBoard = () => {
    document.querySelectorAll('td').forEach( elem => {
      elem.innerText = '';
      elem.style.backgroundColor = 'white';
    });
    boardState.forEach( row => {
      row.forEach( cell => {
        cell = '';
      });
    });
  };

  /*
  * Initialize model
  */
  let gameSize = 3;
  let playsMade = 0;
  let isXTurn = true;
  let isTieGame = false;
  let gameIsEnded = false;
  let boardState = setupBoardState(gameSize);
  let boardElement = createBoardElements(boardState);

  /*
  * Function: Render game to DOM
  */
  const renderGame = (boardElement) => {
    var gameElement = document.getElementById("game"); // get game div
    gameElement.innerHTML = '';
    gameElement.appendChild(boardElement);
    document.getElementById('winnerMessage').innerText = '';
    console.log(gameElement);
  };
  /*
  * Aaaaaaaand render!
  */
  renderGame(boardElement);

  /*
  * Add reset function to our reset button
  */
  var button = document.getElementById('resetButton');
  button.onclick = () => {resetBoard()};

});
