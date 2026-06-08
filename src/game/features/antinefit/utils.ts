import { getPlayerState } from "@game/player/store";
import { triggerResetLayer } from "@game/resetLayers/utils/apply";
import { hasUpgradeById } from "@game/upgrades/utils/has";

export function toggleAntinefit() {
  const { mergedPlayer, setMergedPlayer } = getPlayerState();
  const { player } = mergedPlayer;
  const { enteredAntinefit, everEnteredAntinefit, everLeftAntinefit } = player;

  if (!enteredAntinefit && !hasUpgradeById(player, "nullith_12")) return;

  const triggeredReset = triggerResetLayer(mergedPlayer, "nullith");

  const newValue = !enteredAntinefit;

  setMergedPlayer({
    ...triggeredReset,
    player: {
      ...triggeredReset.player,
      enteredAntinefit: newValue,
      everEnteredAntinefit: everEnteredAntinefit || newValue,
      everLeftAntinefit:
        everLeftAntinefit || (!newValue && everEnteredAntinefit),
    },
  });
}
