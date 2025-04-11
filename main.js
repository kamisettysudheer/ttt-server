import { createApp } from "./src/app.js";
import { queueManager } from "./src/models/waitingQueue.js";

const main = () => {
  const queue = new queueManager(2);
  const myContext = {
    gameSession: new Map(),
    idGenerator: () => Date.now().toString(),
  };
  const app = createApp(queue, myContext);
  const port = Deno.env.get("PORT") || 3000;
  Deno.serve({ port }, app.fetch);
};

main();
