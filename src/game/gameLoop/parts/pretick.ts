import { getPlayerState } from "@game/player/store";
import { copyObject } from "@core/utils/object";
import { mergePlayer } from "@game/player/merged/utils";
import { createGameLoopPartState } from "../utils/create";
import offlineConfig from "@game/offline/config";
import { clamp, safeNumber } from "@core/utils/number";
import { calculateTicksForOfflineTime } from "@game/offline/utils/calculate";

export default function gameLoopPreTick(currentTime: number) {
  const { player, cachedPlayer, setMergedPlayer } = getPlayerState();

  const newPlayer = copyObject(player);
  const newCachedPlayer = copyObject(cachedPlayer);

  const mergedPlayer = mergePlayer(newPlayer, newCachedPlayer);
  const partState = createGameLoopPartState(mergedPlayer, currentTime);

  const { offlineProgress, offlineProgressFullTime } = newCachedPlayer;

  let timeSpeed = 1;
  if (offlineProgress) {
    const offlineProgressSpeed = safeNumber(
      clamp(newCachedPlayer.offlineProgressSpeed, 1, offlineConfig.maxSpeed),
      1,
    );
    newCachedPlayer.offlineProgressSpeed = offlineProgressSpeed;

    const ticksOnTrigger = calculateTicksForOfflineTime(
      offlineProgressFullTime,
    );

    const tickTime =
      (offlineProgressSpeed / ticksOnTrigger) * offlineProgressFullTime;
    if (partState.deltaTimeTPS > 0) {
      timeSpeed = tickTime / partState.deltaTimeTPS;
    }
    if (!Number.isFinite(timeSpeed) || timeSpeed < 0) {
      timeSpeed = 1;
    }
  }

  newCachedPlayer.timeSpeed = timeSpeed;
  partState.deltaTime *= timeSpeed;

  return { partState, setMergedPlayer };
}
