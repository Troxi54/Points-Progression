import type { GameLoopPartState } from "../types";
import { clamp, safeNumber } from "@core/utils/number";
import offlineConfig from "@game/offline/config";
import { calculateTicksForOfflineTime } from "@game/offline/utils/calculate";

export default function gameLoopPreTick(state: GameLoopPartState) {
  const {
    mergedPlayer: { cachedPlayer },
  } = state;

  const { offlineProgress, offlineProgressFullTime } = cachedPlayer;

  let timeSpeed = 1;
  if (offlineProgress) {
    const offlineProgressSpeed = safeNumber(
      clamp(cachedPlayer.offlineProgressSpeed, 1, offlineConfig.maxSpeed),
      1,
    );
    cachedPlayer.offlineProgressSpeed = offlineProgressSpeed;

    const ticksOnTrigger = calculateTicksForOfflineTime(
      offlineProgressFullTime,
    );

    const tickTime =
      (offlineProgressSpeed / ticksOnTrigger) * offlineProgressFullTime;
    if (state.deltaTimeTPS > 0) {
      timeSpeed = tickTime / state.deltaTimeTPS;
    }
    if (!Number.isFinite(timeSpeed) || timeSpeed < 0) {
      timeSpeed = 1;
    }
  }

  cachedPlayer.timeSpeed = timeSpeed;
  state.deltaTime *= timeSpeed;
}
