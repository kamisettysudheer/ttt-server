# 🎮 Tic Tac Toe Multiplayer Server

A multiplayer Tic Tac Toe server built with [Hono](https://hono.dev) and [Deno](https://deno.land). The server automatically pairs players into games and manages game sessions until completion.

---

## 🚀 Features

- Auto-pairing of players: no lobby or room selection
- Each pair of players is assigned a unique game session
- Turn-based gameplay managed completely on the server
- Game ends when a player wins or it's a draw
- Players are prompted to play again after each match

---

## 🧠 Player Flow

### 🎮 Flow 1: Single Player Waiting for an Opponent

1. A player visits the homepage.
2. The player is prompted to enter their name.
3. The server puts them into a **"waiting queue"**.
4. The player sees a **"Waiting for opponent..."** message.
5. When another player joins, a game session is created, and the game starts.

### 🎮 Flow 2: Two Players Join a Match

1. Player A visits the home page and enters their name ("Alice").
2. Alice is told to wait for an opponent.
3. Player B visits the site shortly after and enters their name ("Bob").
4. The server matches Alice and Bob together.
5. A new game session is created.
6. Alice plays as `"X"` and Bob plays as `"O"` (or vice versa).
7. They take turns making moves. The game proceeds until:
   - A player wins → winner is announced.
   - OR it ends in a draw → draw is announced.
8. Both players are shown a message asking if they’d like to **play again**.
   - If they choose yes, they are put back into the waiting queue.
   - If not, they leave the game.

---

### ▶️ Run the Server

```bash
deno task start
```
# ttt-server
new line in readme.md
abc
