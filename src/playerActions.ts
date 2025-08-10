import Decimal from "break_eternity.js";
import { usePlayerStore } from "./player/playerStore";
import { settings } from "./player/settings";
import { triggerVermyrosReset } from "./resets";

export function toggleAmplivault() {
  const { player, setPlayer } = usePlayerStore.getState();
  if (
    !player.enteredAmplivault &&
    (!player.boughtFifthVermyrosUpgrade || player.amplivaultBroken)
  )
    return;

  setPlayer({
    ...triggerVermyrosReset(player),
    enteredAmplivault: !player.enteredAmplivault
  });
}

export function convertEnergyIntoCores() {
  const { player, cachedPlayer, setPlayer } = usePlayerStore.getState();
  if (player.energy.lessThan(settings.coresAt)) return;

  setPlayer({
    everMadeCoreReset: true,
    cores: player.cores.plus(cachedPlayer.coreGain),
    energyReactors: player.boughtSecondNullithUpgrade
      ? player.energyReactors
      : new Decimal(0),
    energy: new Decimal(0)
  });
}

export function breakAmplivault() {
  const { player, setPlayer } = usePlayerStore.getState();
  if (player.amplivaultBroken || !player.reachedBreakAmplivault) return;

  setPlayer({
    amplivaultBroken: true,
    enteredAmplivault: false
  });
}

export function convertNullithResetsIntoNullions() {
  const { player, cachedPlayer, setPlayer } = usePlayerStore.getState();

  if (
    cachedPlayer.nullionInputConverted.greaterThan(player.madeNullithResets) ||
    cachedPlayer.nullionGain.lessThanOrEqualTo(0)
  )
    return;

  setPlayer({
    nullions: player.nullions.plus(cachedPlayer.nullionGain),
    madeNullithResets: player.madeNullithResets.minus(
      cachedPlayer.nullionInputConverted
    )
  });
}

export function toggleSliph() {
  const { player, setPlayer } = usePlayerStore.getState();
  if (!player.enteredAmplivault && !player.boughtFifthNullithUpgrade) return;

  const enter = !player.enteredSliph;

  setPlayer({
    enteredSliph: enter,
    ...(enter && !player.everEnteredSliph ? { everEnteredSliph: true } : {}),
    ...(enter && player.mallirtStartedDate === null
      ? { mallirtStartedDate: Date.now() }
      : {})
  });
}
