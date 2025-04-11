export class queueManager {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.queue = { gameId: null, players: [] };
    this.peekCounter = 0;
    this.players = [];
  }

  addToQueue(player) {
    if (!this.queue.gameId) {
      this.queue.gameId = Date.now().toString();
    }

    this.queue.players.push(player);

    return this.queue.gameId;
  }

  getQueue() {
    return this.queue;
  }

  isQueueFull() {
    return this.queue.players.length >= this.maxSize;
  }

  clearQueue() {
    this.queue.players = [];
    this.queue.gameId = null;
  }

  peek() {
    if (!this.isQueueFull()) return null;

    this.players.push(this.queue.players[this.peekCounter]);
    this.peekCounter += 1;

    if (this.peekCounter === this.maxSize) {
      this.peekCounter = 0;
      this.clearQueue();
      return true;
    }

    return this.queue;
  }
}
