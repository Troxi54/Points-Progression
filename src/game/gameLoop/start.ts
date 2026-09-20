import { updateCurrentTime } from "@core/utils/time";
import gameLoopTick from "./tick";

const requestTick = () => requestAnimationFrame(tick);

function tick() {
  updateCurrentTime();
  gameLoopTick();

  requestTick();
}

export default function startGameLoop() {
  requestTick();
}
