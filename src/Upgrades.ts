import { Player } from "./components/PlayerContext";
import { settings } from "./playerUtils";

export function buyMax(updates: Player) {
  if (updates.points.lessThan(updates.upgradeCost)) return;
  const SCALING = settings.upgradeScaling;
  const bulk = updates.points.dividedBy(updates.upgradeCost).log(SCALING).floor();
  const finalCost = updates.upgradeCost.multiply(SCALING.pow(bulk));
  return {
    points: updates.boughtFirstResetUpgrade ? updates.points : updates.points.minus(finalCost),
    upgradeLvl: updates.upgradeLvl.plus(bulk.plus(1))
  };
}

export function buyMaxAmpliflux(updates: Player) {
  if (updates.ampliflux.lessThan(updates.amplifluxUpgradeCost) || !updates.boughtFourthTierUpgrade) return;
  const SCALING = settings.amplifluxUpgradeCostScaling;
  const bulk = updates.ampliflux.dividedBy(updates.amplifluxUpgradeCost).log(SCALING).floor();
  const finalCost = updates.amplifluxUpgradeCost.multiply(SCALING.pow(bulk));
  return {
    ampliflux: updates.boughtFifthTierUpgrade ? updates.ampliflux : updates.ampliflux.minus(finalCost),
    amplifluxUpgradeLvl: updates.amplifluxUpgradeLvl.plus(bulk.plus(1))
  };
}

export function buyMaxVermyte(updates: Player) {
  if (updates.vermytes.lessThan(updates.vermytesUpgradeCost) || !updates.everMadeVermyros) return;
  const SCALING = settings.vermytesUpgradeCostScaling;
  const bulk = updates.vermytes.dividedBy(updates.vermytesUpgradeCost).log(SCALING).floor();
  const finalCost = updates.vermytesUpgradeCost.multiply(SCALING.pow(bulk));
  return {
    vermytes: updates.vermytes.minus(finalCost),
    vermytesUpgradeLvl: updates.vermytesUpgradeLvl.plus(bulk.plus(1))
  };
}