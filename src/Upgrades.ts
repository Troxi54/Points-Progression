import Decimal from "break_eternity.js";
import { Player } from "./components/PlayerContext";
import { settings } from "./playerUtils";

export function buyMax(updates: Player, justUpdateBulk: boolean = false) {
  const array = { upgradeBulk: updates.points.dividedBy(updates.upgradeCost).log(settings.upgradeScaling).floor().plus(updates.points.greaterThanOrEqualTo(updates.upgradeCost) ? 1 : 0)};
  if (updates.points.lessThan(updates.upgradeCost) || justUpdateBulk) return array;
  const finalCost = updates.upgradeCost.multiply(settings.upgradeScaling.pow(array.upgradeBulk.minus(1)));
  return {
    upgradeBulk: new Decimal(0),
    points: updates.boughtFirstResetUpgrade ? updates.points : updates.points.minus(finalCost),
    upgradeLvl: updates.upgradeLvl.plus(array.upgradeBulk)
  };
}

export function buyMaxAmpliflux(updates: Player, justUpdateBulk: boolean = false) {
  const array = { amplifluxUpgradeBulk: updates.ampliflux.dividedBy(updates.amplifluxUpgradeCost).log(settings.amplifluxUpgradeCostScaling).floor().plus(updates.ampliflux.greaterThanOrEqualTo(updates.amplifluxUpgradeCost) ? 1 : 0)};
  if (updates.ampliflux.lessThan(updates.amplifluxUpgradeCost) || !updates.boughtFourthTierUpgrade || justUpdateBulk) return array;
  const finalCost = updates.amplifluxUpgradeCost.multiply(settings.amplifluxUpgradeCostScaling.pow(array.amplifluxUpgradeBulk.minus(1)));
  return {
    amplifluxUpgradeBulk: new Decimal(0),
    ampliflux: updates.boughtFifthTierUpgrade ? updates.ampliflux : updates.ampliflux.minus(finalCost),
    amplifluxUpgradeLvl: updates.amplifluxUpgradeLvl.plus(array.amplifluxUpgradeBulk),
  };
}

export function buyMaxVermyte(updates: Player, justUpdateBulk: boolean = false) {
  const array = { vermytesUpgradeBulk: updates.vermytes.dividedBy(updates.vermytesUpgradeCost).log(settings.vermytesUpgradeCostScaling).floor().plus(updates.vermytes.greaterThanOrEqualTo(updates.vermytesUpgradeCost) ? 1 : 0)};
  if (updates.vermytes.lessThan(updates.vermytesUpgradeCost) || !updates.everMadeVermyros || justUpdateBulk) return;
  const finalCost = updates.vermytesUpgradeCost.multiply(settings.vermytesUpgradeCostScaling.pow(array.vermytesUpgradeBulk.minus(1)));
  return {
    vermytesUpgradeBulk: new Decimal(0),
    vermytes: updates.vermytes.minus(finalCost),
    vermytesUpgradeLvl: updates.vermytesUpgradeLvl.plus(array.vermytesUpgradeBulk)
  };
}