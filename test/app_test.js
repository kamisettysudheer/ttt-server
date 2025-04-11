import { assertEquals, assertFalse } from "jsr:@std/assert";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { createApp } from "../src/app.js";
import { queueManager } from "../src/models/waitingQueue.js";
import { TicTacToe } from "../src/models/ttt.js";

const cookieParser = (cookie) => {
  const rawCookies = cookie.split(";");
  const cookies = {};

  for (const c of rawCookies) {
    const [name, value] = c.split("=");
    cookies[name] = value;
  }

  return cookies;
};

describe("App", () => {
  let queue;
  let myContext;
  let app;
  beforeEach(() => {
    queue = new queueManager(2);
    myContext = {
      gameSession: new Map(),
      idGenerator: () => Date.now().toString(),
    };
    app = createApp(queue, myContext);
  });

  describe("GET", () => {
    describe("serveStatic", () => {
      it("should respond with 200 for root", async () => {
        const response = await app.request("/");
        await response.text();
        const contentType = response.headers.get("content-type");
        assertEquals(response.status, 200);
        assertEquals(contentType, "text/html; charset=utf-8");
      });

      it("should respond with 404 for non-existent page", async () => {
        const response = await app.request("/non-existent-page");
        assertEquals(response.status, 404);
      });

      it("should respond with 404 for non-existent static file", async () => {
        const response = await app.request("/non-existent-file.html");
        assertEquals(response.status, 404);
      });

      it("should respond with 200 for existing static file", async () => {
        const response = await app.request("/index.html");
        await response.text();
        assertEquals(response.status, 200);
        const contentType = response.headers.get("content-type");
        assertEquals(contentType, "text/html; charset=utf-8");
      });

      it("should respond with 200 for existing waiting page", async () => {
        const response = await app.request("/waiting.html");
        await response.text();
        assertEquals(response.status, 200);
      });

      it("should respond with 200 for existing game page", async () => {
        const response = await app.request("/game.html");
        await response.text();
        assertEquals(response.status, 200);
      });
    });
    describe("/gameState", () => {
      it("should respond with 200 for getGameState", async () => {
        myContext.gameSession.set("123", {
          playerName: "sudheer",
          gameId: "1",
          ttt: new TicTacToe(),
        });

        const req = new Request("http://localhost/gameState", {
          headers: {
            cookie: "playerId=123",
          },
        });
        const response = await app.request(req);

        assertEquals(response.status, 200);
        assertEquals(await response.json(), {
          gameOver: false,
          isDraw: false,
          winner: null,
          board: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ],
          player: "sudheer",
        });
      });
    });
    describe("/game", () => {
      it("should respond with false in isMatchNotFound for one player in queue", async () => {
        const formData = new FormData();
        formData.set("playerName", "sudheer");
        const req1 = new Request("http://localhost/join", {
          method: "POST",
          body: formData,
        });

        await app.request(req1);
        const response = await app.request("/game");

        assertEquals(response.status, 200);
        assertEquals(await response.json(), { isMatchFound: false });
      });

      it("should respond with 200 for two players in queue and same gameId for both players", async () => {
        const formData = new FormData();
        formData.set("playerName", "sudheer");
        const req1 = new Request("http://localhost/join", {
          method: "POST",
          body: formData,
        });
        const formData2 = new FormData();
        formData2.set("playerName", "suman");
        const req2 = new Request("http://localhost/join", {
          method: "POST",
          body: formData2,
        });

        const res1 = await app.request(req1);
        const res2 = await app.request(req2);
        const response = await app.request("/game");
        const { playerId: pId1 } = cookieParser(res1.headers.get("set-cookie"));
        const { playerId: pId2 } = cookieParser(res2.headers.get("set-cookie"));
        const { gameId: gId1 } = myContext.gameSession.get(pId1);
        const { gameId: gId2 } = myContext.gameSession.get(pId2);
        assertEquals(response.status, 200);
        assertEquals(await response.json(), { isMatchFound: true });
        assertEquals(gId1, gId2);
      });

      // it("should respond with different gameId for third player with  first two players gameId", async () => {
      //   const formData = new FormData();
      //   formData.set("playerName", "sudheer");
      //   const req1 = new Request("http://localhost/join", {
      //     method: "POST",
      //     body: formData,
      //   });
      //   const formData2 = new FormData();
      //   formData2.set("playerName", "suman");
      //   const req2 = new Request("http://localhost/join", {
      //     method: "POST",
      //     body: formData2,
      //   });
      //   const formData3 = new FormData();
      //   formData3.set("playerName", "shyam");
      //   const req3 = new Request("http://localhost/join", {
      //     method: "POST",
      //     body: formData3,
      //   });

      //   const res1 = await app.request(req1);
      //   const res2 = await app.request(req2);
      //   const response = await app.request("/game");
      //   const res3 = await app.request(req3);
      //   const { playerId: pId1 } = cookieParser(res1.headers.get("set-cookie"));
      //   const { playerId: pId2 } = cookieParser(res2.headers.get("set-cookie"));
      //   const { playerId: pId3 } = cookieParser(res3.headers.get("set-cookie"));
      //   const { gameId: gId1 } = myContext.gameSession.get(pId1);
      //   const { gameId: gId2 } = myContext.gameSession.get(pId2);
      //   const { gameId: gId3 } = myContext.gameSession.get(pId3);
      //   assertEquals(response.status, 200);
      //   assertEquals(await response.json(), { isMatchFound: true });
      //   console.log("--------------", gId1, gId2, gId3, "------------");
      //   assertEquals(gId1, gId2);
      //   // assertEquals(gId1 === gId3, false);
      //   // assertEquals(gId2 === gId3, false);
      // });
    });
  });

  describe("JOIN", () => {
    describe("/join", () => {
      it("should respond with 303 redirecting for join", async () => {
        myContext.idGenerator = () => "1";
        const formData = new FormData();
        formData.set("playerName", "sudheer");
        const req = new Request("http:localhost/join", {
          method: "POST",
          body: formData,
        });
        const response = await app.request(req);
        assertEquals(response.status, 303);
        const location = response.headers.get("location");
        assertEquals(location, "/waiting.html");
        const { playerId } = cookieParser(response.headers.get("set-cookie"));
        assertEquals(playerId, "1");
        assertEquals(myContext.gameSession.size, 1);
      });
    });
    describe("/mark", () => {
      it("should respond with 201 for marking", async () => {
        myContext.gameSession.set("123", {
          playerName: "sudheer",
          gameId: "1",
          ttt: new TicTacToe(),
        });

        const fd = new FormData();
        fd.set("boxId", 0);
        const req = new Request("http:localhost/mark", {
          method: "POST",
          body: fd,
          headers: {
            cookie: "playerId=123",
          },
        });
        const response = await app.request(req);

        assertEquals(response.status, 201);
        assertEquals(await response.text(), "marked");
      });
    });
  });
});
