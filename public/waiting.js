const main = () => {
  const intervalId = setInterval(async () => {
    const res = await fetch("/game");
    const { isMatchFound } = await res.json();
    if (isMatchFound) {
      clearInterval(intervalId);
      globalThis.location = "/game.html";
    }
  }, 1000);
};

globalThis.onload = main;
