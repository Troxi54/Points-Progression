import formulas from "@game/formulas/data";
import { getPlayerState } from "@/game/player/store/store";
import { MergedPlayer } from "@/game/player/merged/types";
import { triggerResetLayer } from "@/game/resetLayers/utils/apply";
import { hasUpgradeById } from "@/game/upgrades/utils/has";

function shouldAmplivaultIncreaseLevel({ player, cachedPlayer }: MergedPlayer) {
  return (
    (player.enteredAmplivault || player.amplivaultBroken) &&
    player.points.greaterThanOrEqualTo(cachedPlayer.amplivaultRequirement)
  );
}

export function getNewAmplivaultLevel(mergedPlayer: MergedPlayer) {
  const currentLevel = mergedPlayer.player.amplivaultLevel;
  if (!shouldAmplivaultIncreaseLevel(mergedPlayer)) return currentLevel;

  const bulk = formulas.amplivaultBulk(mergedPlayer);
  return currentLevel.plus(bulk);
}

export function toggleAmplivault() {
  const { mergedPlayer, setMergedPlayer } = getPlayerState();
  const { player } = mergedPlayer;

  if (
    !player.enteredAmplivault &&
    (!hasUpgradeById(player, "vermyros_5") || player.amplivaultBroken)
  )
    return;

  const triggeredReset = triggerResetLayer(mergedPlayer, "vermyros");

  setMergedPlayer({
    ...triggeredReset,
    player: {
      ...triggeredReset?.player,
      enteredAmplivault: !player.enteredAmplivault
    }
  });
}

export function breakAmplivault() {
  const { player, setPlayer } = getPlayerState();

  if (player.amplivaultBroken || !player.reachedBreakAmplivault) return;

  setPlayer({
    amplivaultBroken: true,
    enteredAmplivault: false
  });
}
