import type { MergedPlayer } from "@game/player/merged/types";
import type { RepeatableUpgradeId } from "../ids";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import { parseValueGetter } from "@game/player/utils";
import {
  calculateRepeatableUpgradeBulk,
  calculateRepeatableUpgradeCost,
} from "./calculate";
import { getRepeatableUpgradeConfig, getRepeatableUpgradeLevel } from "./get";
import { updateCachedRepeatableUpgrade } from "./update";

export function buyRepeatableUpgradeWithBulk(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
) {
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

  if (spendCurrency) {
    player[currency] = currencyValue.minus(costWithBulk);
  }

  player.repeatableUpgrades[repeatableUpgradeId] = newLevel;
}

export function buyRepeatableUpgradeMax(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
) {
  buyRepeatableUpgradeWithBulk(mergedPlayer, repeatableUpgradeId);
  updateCachedRepeatableUpgrade(mergedPlayer, repeatableUpgradeId);
}
