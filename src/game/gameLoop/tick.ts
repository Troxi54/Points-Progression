import { updateCurrentTime } from "@core/utils/time";
import { triggerOfflineProgress } from "@game/offline/utils/trigger";
import { getPlayerState } from "@game/player/store";
import gameLoopActions from "./parts/actions";
import gameLoopUpdateCache from "./parts/cacheUpdates";
import gameLoopPostTick from "./parts/postTick";
import gameLoopPreTick from "./parts/preTick";
import { createGameLoopPartState } from "./utils/create";

export default function gameLoopTick() {
  updateCurrentTime();

  triggerOfflineProgress();

  const { setMergedPlayer } = getPlayerState();

  setMergedPlayer((mergedPlayer) => {
    const state = createGameLoopPartState(mergedPlayer);

    gameLoopPreTick(state);

    gameLoopUpdateCache(state);
    gameLoopActions(state);
    gameLoopUpdateCache(state);

    gameLoopPostTick(state);
  });
}
