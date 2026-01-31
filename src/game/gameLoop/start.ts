import { getCurrentTime } from "@/core/utils/time";
import gameLoopTick from "./tick";

const requestTick = () => requestAnimationFrame(tick);

function tick() {
  const currentTime = getCurrentTime();
  gameLoopTick(currentTime);

  requestTick();
}

export default function startGameLoop() {
  requestTick();
}
