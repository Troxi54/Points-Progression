import { fixGameTime } from "@core/utils/time";
import { MergedPlayer } from "@game/player/merged/types";

export function setFixedResetLayerDates(
  mergedPlayer: MergedPlayer,
  currentGameTime: number,
) {
  const container = mergedPlayer.player.resetLayers;

  for (const data of Object.values(container)) {
    if (!data) continue;

    data.startedDate = fixGameTime(
      mergedPlayer,
      data.startedDate,
      currentGameTime,
    );
  }
}
