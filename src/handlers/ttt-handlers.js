import { getCookie, setCookie } from "hono/cookie";
import { TicTacToe } from "../models/ttt.js";

export const handleJoinGame = async (context) => {
  const queue = context.get("queue");
  const { playerName } = await context.req.parseBody();
  const { gameSession, idGenerator } = context.get("myContext");
  const gameId = queue.addToQueue(playerName);
  const playerId = idGenerator();

  gameSession.set(playerId, { playerName, gameId });
  setCookie(context, "playerId", playerId);

  return context.redirect("/waiting.html", 303);
};

export const handleMatchPlayer = (context) => {
  const queue = context.get("queue");
  const { gameSession } = context.get("myContext");
  const matchData = queue.peek();
  const isMatchFound = Boolean(matchData);
  const playerId = getCookie(context, "playerId");
  const hasGameInstanceCreated = gameSession.get(playerId)?.ttt;

  if (isMatchFound && !hasGameInstanceCreated) {
    const ttt = new TicTacToe(...matchData.players);

    for (const [_, player] of gameSession) {
      if (player.gameId === matchData.gameId) {
        player.ttt = ttt;
      }
    }
  }

  return context.json({ isMatchFound });
};

export const handleGetGameState = (context) => {
  const { gameSession } = context.get("myContext");
  const playerId = getCookie(context, "playerId");
  const { playerName, ttt } = gameSession.get(playerId);

  const gameState = {
    gameOver: ttt.isGameOver(),
    isDraw: ttt.isDraw(),
    winner: ttt.getWinner(),
    board: ttt.getBoard(),
    curPlayer: ttt.getCurrentPlayer(),
    player: playerName,
  };

  return context.json(gameState);
};

export const handleMark = async (context) => {
  const { gameSession } = context.get("myContext");
  const playerId = getCookie(context, "playerId");
  const { ttt } = gameSession.get(playerId);
  const { boxId } = await context.req.parseBody();
  const col = boxId % 3;
  const row = Math.floor(boxId / 3);
  ttt.mark(row, col);

  return context.text("marked", 201);
};
