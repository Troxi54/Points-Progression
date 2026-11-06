import { updateCurrentTime } from "@core/utils/time";
import { triggerOfflineProgress } from "@game/offline/utils/trigger";
import gameLoopActions from "./parts/actions";
import gameLoopUpdateCache from "./parts/cacheUpdates";
import gameLoopPostTick from "./parts/postTick";
import gameLoopPreTick from "./parts/preTick";

export default function gameLoopTick() {
  updateCurrentTime();

  triggerOfflineProgress();

  const { partState, setMergedPlayer } = gameLoopPreTick();

  gameLoopUpdateCache(partState);
  gameLoopActions(partState);
  gameLoopUpdateCache(partState);

  gameLoopPostTick(partState);

  setMergedPlayer(partState.mergedPlayer);
}
