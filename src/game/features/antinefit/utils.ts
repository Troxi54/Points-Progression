import { objectAssign } from "@core/utils/object";
import { getPlayerState } from "@game/player/store";
import { triggerResetLayer } from "@game/resetLayers/utils/trigger";
import { hasUpgradeById } from "@game/upgrades/utils/has";

export function toggleAntinefit() {
  const { mergedPlayer, setMergedPlayer } = getPlayerState();
  const { player } = mergedPlayer;
  const { enteredAntinefit, everEnteredAntinefit, everLeftAntinefit } = player;

  if (!enteredAntinefit && !hasUpgradeById(player, "nullith_12")) return;

  setMergedPlayer((mergedPlayer) => {
    triggerResetLayer(mergedPlayer, "nullith");

    const newValue = !enteredAntinefit;

    objectAssign(player, {
      enteredAntinefit: newValue,
      everEnteredAntinefit: everEnteredAntinefit || newValue,
      everLeftAntinefit:
        everLeftAntinefit || (!newValue && everEnteredAntinefit),
    });
  });
}
