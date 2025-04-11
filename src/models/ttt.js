export class TicTacToe {
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.symbols = ["X", "O"];
    this.board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
    this.currentPlayerIndex = 0;
    this.winner = null;
    this.moves = 0;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getCurrentSymbol() {
    return this.symbols[this.currentPlayerIndex];
  }

  mark(row, col) {
    if (this.board[row][col] || this.isGameOver()) {
      return false; // Invalid move
    }

    this.board[row][col] = this.getCurrentSymbol();
    this.moves++;

    if (this.checkWinner(row, col)) {
      this.winner = this.getCurrentPlayer();
    } else {
      this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    return true;
  }

  checkWinner(row, col) {
    const symbol = this.getCurrentSymbol();
    const board = this.board;

    // Check row
    if (board[row].every((cell) => cell === symbol)) return true;
    // Check column
    if (board.every((r) => r[col] === symbol)) return true;
    // Check diagonal
    if (row === col && board.every((r, i) => r[i] === symbol)) return true;
    // Check anti-diagonal
    if (row + col === 2 && board.every((r, i) => r[2 - i] === symbol))
      return true;

    return false;
  }

  isGameOver() {
    return this.winner !== null || this.moves === 9;
  }

  getWinner() {
    return this.winner;
  }

  isDraw() {
    return this.moves === 9 && this.winner === null;
  }

  getBoard() {
    return this.board.map((row) => row.slice()); // Return a copy
  }

  reset() {
    this.board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
    this.currentPlayerIndex = 0;
    this.winner = null;
    this.moves = 0;
  }
}
