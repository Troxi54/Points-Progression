import { triggerOfflineProgress } from "@game/offline/utils/trigger";
import gameLoopActions from "./parts/actions";
import gameLoopUpdateCache from "./parts/cacheUpdates";
import gameLoopPostTick from "./parts/posttick";
import gameLoopPreTick from "./parts/pretick";

export default function gameLoopTick() {
  triggerOfflineProgress();

  const { partState, setMergedPlayer } = gameLoopPreTick();

  gameLoopUpdateCache(partState);
  gameLoopActions(partState);
  gameLoopUpdateCache(partState);

  gameLoopPostTick(partState);

  setMergedPlayer(partState.mergedPlayer);
}
