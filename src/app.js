import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import {
  handleMatchPlayer,
  handleJoinGame,
  handleMark,
  handleGetGameState,
} from "./handlers/ttt-handlers.js";

const setMyContext = (queue, myContext) => {
  return (c, next) => {
    c.set("queue", queue);
    c.set("myContext", myContext);
    return next();
  };
};

export const createApp = (queue, myContext) => {
  const app = new Hono();
  app.use("*", logger());
  app.use("*", setMyContext(queue, myContext));
  app.post("/join", handleJoinGame);
  app.post("/mark", handleMark);
  app.get("/gameState", handleGetGameState);
  app.get("/game", handleMatchPlayer);
  app.get("*", serveStatic({ root: "./public" }));
  return app;
};
