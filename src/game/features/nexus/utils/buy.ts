import { getPlayerState } from "@/game/player/store/store";
import { getNexusCost } from "./get";

export function buyNexus() {
  const {
    player: { nux, nexusLevel, bestNexusLevel },
    mergedPlayer,
    setPlayer
  } = getPlayerState();

  const cost = getNexusCost(mergedPlayer);
  if (!cost || nux.lessThan(cost)) return;

  const newNexusLevel = nexusLevel.plus(1);

  setPlayer({
    nexusLevel: newNexusLevel,
    bestNexusLevel: bestNexusLevel.max(newNexusLevel),
    nux: nux.minus(cost)
  });
}
