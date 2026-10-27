import { shouldDimensionWork } from "@game/dimensions/utils/check";
import type {
  MergedPlayer,
  PartialMergedPlayer,
} from "@game/player/merged/types";
import type { PartialPlayer } from "@game/player/types";
import { parseValueGetter } from "@game/player/utils";
import type Decimal from "break_eternity.js";
import type { RepeatableUpgradeId, RepeatableUpgrade } from "../types";
import {
  calculateRepeatableUpgradeCost,
  calculateRepeatableUpgradeBulkWithMax,
  getRepeatableUpgradeBulkCostAndLevel,
} from "./calculate";
import { getRepeatableUpgradeData, getRepeatableUpgradeLevel } from "./get";
import { setRepeatableUpgradeLevel } from "./set";
import { updateCachedRepeatableUpgrade } from "./update";
import createDecimal from "@core/utils/decimal";

export function buyRepeatableUpgradeWithBulk(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
  bulkFormula: (repeatableUpgradeData: RepeatableUpgrade) => Decimal,
): PartialPlayer | undefined {
  const upgradeData = getRepeatableUpgradeData(repeatableUpgradeId);

  const { player } = mergedPlayer;

  const dimensionWorks = shouldDimensionWork(
    mergedPlayer,
    upgradeData.dimensionId,
  );
  if (!dimensionWorks) return;

  const upgradeCondition = parseValueGetter(
    upgradeData.condition,
    mergedPlayer,
  );
  if (!upgradeCondition) return;

  const { currency } = upgradeData;
  const currencyValue = mergedPlayer.player[currency];

  const currentLevel = getRepeatableUpgradeLevel(player, repeatableUpgradeId);
  const currentCost = calculateRepeatableUpgradeCost(upgradeData, currentLevel);
  const hasEnoughCurrency = currencyValue.greaterThanOrEqualTo(currentCost);

  if (!hasEnoughCurrency) return;

  const bulkFromFormula = bulkFormula(upgradeData);
  const bulk = calculateRepeatableUpgradeBulkWithMax(
    mergedPlayer,
    upgradeData,
    currentLevel,
    bulkFromFormula,
  );

  if (bulk.lessThanOrEqualTo(0)) return;

  const newLevel = currentLevel.plus(bulk);
  const costWithBulk = calculateRepeatableUpgradeCost(
    upgradeData,
    newLevel.minus(1),
  );
  const hasEnoughCurrencyWithBulk =
    currencyValue.greaterThanOrEqualTo(costWithBulk);

  if (!hasEnoughCurrencyWithBulk) return;

  const spendCurrency = parseValueGetter(
    upgradeData.spendCurrency,
    mergedPlayer,
  );

  return {
    ...setRepeatableUpgradeLevel(player, repeatableUpgradeId, newLevel),
    ...(spendCurrency ? { [currency]: currencyValue.minus(costWithBulk) } : {}),
  };
}

export function buyRepeatableUpgradeWithBulkAndUpdates(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
  bulkFormula: (repeatableUpgradeData: RepeatableUpgrade) => Decimal,
): PartialMergedPlayer {
  const purchased = buyRepeatableUpgradeWithBulk(
    mergedPlayer,
    repeatableUpgradeId,
    bulkFormula,
  );
  const updated = updateCachedRepeatableUpgrade(
    mergedPlayer,
    repeatableUpgradeId,
  );

  return {
    player: purchased,
    cachedPlayer: updated,
  };
}

export function buyRepeatableUpgradeSingle(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
): PartialMergedPlayer {
  return buyRepeatableUpgradeWithBulkAndUpdates(
    mergedPlayer,
    repeatableUpgradeId,
    () => createDecimal(1),
  );
}

export function buyRepeatableUpgradeMax(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
): PartialMergedPlayer {
  return buyRepeatableUpgradeWithBulkAndUpdates(
    mergedPlayer,
    repeatableUpgradeId,
    () => {
      const [bulk] = getRepeatableUpgradeBulkCostAndLevel(
        repeatableUpgradeId,
        mergedPlayer,
      );

      return bulk;
    },
  );
}
