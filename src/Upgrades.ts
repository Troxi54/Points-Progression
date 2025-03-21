import { Player } from "./components/PlayerContext";
import { settings } from "./playerUtils";

export function buyMax(updates: Player) {
  if (updates.points.lessThan(updates.upgradeCost)) return;
  const finalCost = updates.upgradeCost.multiply(settings.upgradeScaling.pow(updates.upgradeBulk.minus(1)));
  return {
    points: updates.boughtFirstResetUpgrade ? updates.points : updates.points.minus(finalCost),
    upgradeLvl: updates.upgradeLvl.plus(updates.upgradeBulk)
  };
}

export function buyMaxAmpliflux(updates: Player) {
  if (updates.ampliflux.lessThan(updates.amplifluxUpgradeCost) || !updates.boughtFourthTierUpgrade) return;
  const finalCost = updates.amplifluxUpgradeCost.multiply(settings.amplifluxUpgradeCostScaling.pow(updates.amplifluxUpgradeBulk.minus(1)));
  return {
    ampliflux: updates.boughtFifthTierUpgrade ? updates.ampliflux : updates.ampliflux.minus(finalCost),
    amplifluxUpgradeLvl: updates.amplifluxUpgradeLvl.plus(updates.amplifluxUpgradeBulk)
  };
}

export function buyMaxVermyte(updates: Player) {
  if (updates.vermytes.lessThan(updates.vermytesUpgradeCost) || !updates.everMadeVermyros) return;
  const finalCost = updates.vermytesUpgradeCost.multiply(settings.vermytesUpgradeCostScaling.pow(updates.vermytesUpgradeBulk.minus(1)));
  return {
    vermytes: updates.vermytes.minus(finalCost),
    vermytesUpgradeLvl: updates.vermytesUpgradeLvl.plus(updates.vermytesUpgradeBulk)
  };
}