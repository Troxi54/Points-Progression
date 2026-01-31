import { getPlayerState } from "@/game/player/store/store";
import coreConfig from "./config";
import createDecimal from "@/core/utils/decimal";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { calculateCurrencyGain } from "@/game/currencies/utils/calculate";

export function convertEnergyIntoCores() {
  const { player, mergedPlayer, setPlayer } = getPlayerState();

  if (player.energy.lessThan(coreConfig.unlocksAt)) return;

  const gain = calculateCurrencyGain(mergedPlayer, "cores");

  setPlayer({
    everMadeCoreReset: true,
    cores: player.cores.plus(gain),
    energyReactors: hasUpgradeById(player, "nullith_2")
      ? player.energyReactors
      : createDecimal(0),
    energy: createDecimal(0)
  });
}
