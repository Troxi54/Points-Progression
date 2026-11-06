import gameLoopTick from "./tick";

const requestTick = () => requestAnimationFrame(tick);

function tick() {
  gameLoopTick();

  requestTick();
}

export default function startGameLoop() {
  requestTick();
}
