import { getPlayerState } from "@game/player/store/store";
import { copyObject } from "@core/utils/object";
import { mergePlayer } from "@game/player/merged/utils";
import { createGameLoopPartState } from "../utils/create";
import offlineConfig from "@game/offline/config";

export default function gameLoopPreTick(currentTime: number) {
  const { player, cachedPlayer, setMergedPlayer } = getPlayerState();

  const newPlayer = copyObject(player);
  const newCachedPlayer = copyObject(cachedPlayer);

  const mergedPlayer = mergePlayer(newPlayer, newCachedPlayer);
  const partState = createGameLoopPartState(mergedPlayer, currentTime);

  let timeSpeed = 1;
  if (newCachedPlayer.offlineProgress) {
    const tickTime =
      (newCachedPlayer.offlineProgressSpeed / offlineConfig.ticksOnTrigger) *
      newCachedPlayer.offlineProgressFullTime;
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
