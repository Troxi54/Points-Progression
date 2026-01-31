import { getCurrentTime } from "@/core/utils/time";
import gameLoopUpdateCache from "./parts/cacheUpdates";
import gameLoopActions from "./parts/actions";
import gameLoopPreTick from "./parts/pretick";
import gameLoopPostTick from "./parts/posttick";

export default function gameLoopTick(currentTime: number = getCurrentTime()) {
  const { partState, setMergedPlayer } = gameLoopPreTick(currentTime);

  gameLoopUpdateCache(partState);
  gameLoopActions(partState);
  gameLoopUpdateCache(partState);

  gameLoopPostTick(partState);

  setMergedPlayer(partState.mergedPlayer);
}
