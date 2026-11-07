import gameLoopUpdateCache from "@game/gameLoop/parts/cacheUpdates";
import { createGameLoopPartState } from "@game/gameLoop/utils/create";
import { triggerOfflineProgress } from "@game/offline/utils/trigger";
import { getPlayerState } from "@game/player/store";

export default function resetGame() {
  const { setMergedPlayer } = getPlayerState();

  setMergedPlayer((mergedPlayer) => {
    const gameLoopPartState = createGameLoopPartState(mergedPlayer);

    gameLoopUpdateCache(gameLoopPartState);
  });

  triggerOfflineProgress();
}
