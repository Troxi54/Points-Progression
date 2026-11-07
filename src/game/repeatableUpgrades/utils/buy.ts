import type {
  MergedPlayer,
  PartialMergedPlayer,
} from "@game/player/merged/types";
import type { PartialPlayer } from "@game/player/types";
import type { RepeatableUpgradeId } from "../ids";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import { parseValueGetter } from "@game/player/utils";
import {
  calculateRepeatableUpgradeBulk,
  calculateRepeatableUpgradeCost,
} from "./calculate";
import { getRepeatableUpgradeConfig, getRepeatableUpgradeLevel } from "./get";
import { setRepeatableUpgradeLevel } from "./set";
import { updateCachedRepeatableUpgrade } from "./update";

export function buyRepeatableUpgradeWithBulk(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
): PartialPlayer | undefined {
  const upgradeConfig = getRepeatableUpgradeConfig(repeatableUpgradeId);

  const { player } = mergedPlayer;

  const dimensionWorks = shouldDimensionWork(
    mergedPlayer,
    upgradeConfig.dimensionId,
  );
  if (!dimensionWorks) return;

  const upgradeCondition = parseValueGetter(
    upgradeConfig.condition,
    mergedPlayer,
  );
  if (!upgradeCondition) return;

  const { currency } = upgradeConfig;
  const currencyValue = mergedPlayer.player[currency];

  const currentLevel = getRepeatableUpgradeLevel(player, repeatableUpgradeId);
  const currentCost = calculateRepeatableUpgradeCost(
    upgradeConfig,
    currentLevel,
  );
  const hasEnoughCurrency = currencyValue.greaterThanOrEqualTo(currentCost);

  if (!hasEnoughCurrency) return;

  const bulk = calculateRepeatableUpgradeBulk(
    mergedPlayer,
    upgradeConfig,
    currencyValue,
    currentLevel,
    currentCost,
  );

  if (bulk.lessThanOrEqualTo(0)) return;

  const newLevel = currentLevel.plus(bulk);
  const costWithBulk = calculateRepeatableUpgradeCost(
    upgradeConfig,
    newLevel.minus(1),
  );
  const hasEnoughCurrencyWithBulk =
    currencyValue.greaterThanOrEqualTo(costWithBulk);

  if (!hasEnoughCurrencyWithBulk) return;

  const spendCurrency = parseValueGetter(
    upgradeConfig.spendCurrency,
    mergedPlayer,
  );

  return {
    ...setRepeatableUpgradeLevel(player, repeatableUpgradeId, newLevel),
    ...(spendCurrency ? { [currency]: currencyValue.minus(costWithBulk) } : {}),
  };
}

export function buyRepeatableUpgradeMax(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
): PartialMergedPlayer {
  const purchased = buyRepeatableUpgradeWithBulk(
    mergedPlayer,
    repeatableUpgradeId,
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
