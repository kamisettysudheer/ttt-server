const showBoard = (board, curPlayer) => {
  const board1D = board.flat();

  const playerName = document.getElementById("curPlayer");
  playerName.textContent = `current player : ${curPlayer}`;
  const gameBoard = document.querySelector("#game-board");
  for (let i = 0; i < board1D.length; i++) {
    const cell = document.getElementById(`${i}`);
    cell.innerText = board1D[i];
  }

  return gameBoard;
};

const refresh = async () => {
  const gameState = await (await fetch("/gameState")).json();
  const { board, curPlayer } = gameState;
  showBoard(board, curPlayer);

  return gameState;
};

const mark = async (event) => {
  const id = event.target.id;
  const fd = new FormData();
  fd.set("boxId", id);

  await fetch("/mark", { method: "POST", body: fd });
};

const displayGameOver = (isDraw, winner) => {
  if (!isDraw) {
    alert(`game won by ${winner}`);
  } else {
    alert("game draw");
  }

  setTimeout(() => {
    globalThis.location = "/";
  }, 3000);
};

const game = async (event) => {
  const { winner, isDraw, gameOver, curPlayer, player } = await refresh();
  console.log(curPlayer, player);

  if (curPlayer === player) {
    await mark(event);
    await refresh();
    if (gameOver) {
      displayGameOver(isDraw, winner);
    }
  } else {
    alert(`${curPlayer} turn`);
  }
};

const main = () => {
  const intervalId = setInterval(async () => {
    const { gameOver, isDraw, winner } = await refresh();
    if (gameOver) {
      clearInterval(intervalId);
      displayGameOver(isDraw, winner);
    }
  }, 1000);

  const gameBoard = document.querySelector("#game-board");
  gameBoard.addEventListener("click", game);
};

globalThis.onload = main;
