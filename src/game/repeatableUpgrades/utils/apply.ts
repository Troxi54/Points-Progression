import { PartialPlayer, PlayerLike } from "@/game/player/types";
import { PartialCachedPlayer } from "@/game/player/cached/types";
import { CachedPlayerLike } from "@/game/player/cached/types";
import { PartialMergedPlayer } from "@/game/player/merged/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { CachedRepeatableUpgrade } from "@/game/player/cached/types";
import { flatRepeatableUpgrades } from "../data";
import { RepeatableUpgrade, RepeatableUpgradeId } from "../types";
import Decimal from "break_eternity.js";
import {
  parseCachedPlayerLike,
  parsePlayerLike,
  parseValueGetter
} from "@/game/player/utils";
import {
  assignCachedPlayerForMergedPlayer,
  assignMergedPlayer
} from "@/game/player/merged/utils";
import {
  copyObject,
  deepCopy,
  mergeObjects,
  objectEntries,
  objectKeys
} from "@/core/utils/object";
import { getRepeatableUpgradeData, getRepeatableUpgradeLevel } from "./get";
import {
  getRepeatableUpgradeBulkCostAndLevel,
  calculateRepeatableUpgradeCost,
  calculateRepeatableUpgradeBulkWithMax,
  getRepeatableUpgradeMaxLevel
} from "./calculate";
import { shouldDimensionWork } from "@/game/dimensions/utils/check";
import createDecimal from "@/core/utils/decimal";

export function applyRepeatableUpgradeLevel(
  playerLike: PlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
  level: Decimal
): PartialPlayer | undefined {
  const player = parsePlayerLike(playerLike);
  if (!player) return;

  const container = player.repeatableUpgrades;
  if (!container) return;

  const newContainer = copyObject(container);
  newContainer[repeatableUpgradeId] = level;

  return { repeatableUpgrades: newContainer };
}

function applyRepeatableUpgradeWithBulk(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
  bulkFormula: (repeatableUpgradeData: RepeatableUpgrade) => Decimal
): PartialPlayer | undefined {
  const upgradeData = getRepeatableUpgradeData(repeatableUpgradeId);

  const { player } = mergedPlayer;

  const dimensionWorks = shouldDimensionWork(
    mergedPlayer,
    upgradeData.dimensionId
  );
  if (!dimensionWorks) return;

  const upgradeCondition = parseValueGetter(
    upgradeData.condition,
    mergedPlayer
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
    bulkFromFormula
  );

  if (bulk.lessThanOrEqualTo(0)) return;

  const newLevel = currentLevel.plus(bulk);
  const costWithBulk = calculateRepeatableUpgradeCost(
    upgradeData,
    newLevel.minus(1)
  );
  const hasEnoughCurrencyWithBulk =
    currencyValue.greaterThanOrEqualTo(costWithBulk);

  if (!hasEnoughCurrencyWithBulk) return;

  const spendCurrency = parseValueGetter(
    upgradeData.spendCurrency,
    mergedPlayer
  );

  return {
    ...applyRepeatableUpgradeLevel(player, repeatableUpgradeId, newLevel),
    ...(spendCurrency ? { [currency]: currencyValue.minus(costWithBulk) } : {})
  };
}

function applyCachedRepeatableUpgrade(
  cachedPlayerLike: CachedPlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
  cachedRepeatableUpgrade: Partial<CachedRepeatableUpgrade>
): PartialCachedPlayer | undefined {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  const container = cachedPlayer?.repeatableUpgrades;
  if (!container) return;

  const newContainer = copyObject(container);

  const oldUpgrade = container[repeatableUpgradeId];
  const newUpgrade = mergeObjects(oldUpgrade, cachedRepeatableUpgrade);
  newContainer[repeatableUpgradeId] = newUpgrade;

  return {
    repeatableUpgrades: newContainer
  };
}

function createUpdatedCachedRepeatableUpgrade(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId
): PartialCachedPlayer | undefined {
  const upgradeData = getRepeatableUpgradeData(repeatableUpgradeId);

  const { cachedPlayer } = mergedPlayer;

  const { effectFormula } = upgradeData;
  const [bulk, cost, level] = getRepeatableUpgradeBulkCostAndLevel(
    repeatableUpgradeId,
    mergedPlayer
  );

  const maxLevel = getRepeatableUpgradeMaxLevel(mergedPlayer, upgradeData);

  const newRepeatableUpgrade: CachedRepeatableUpgrade = {
    cost,
    bulk: calculateRepeatableUpgradeBulkWithMax(
      mergedPlayer,
      upgradeData,
      level,
      bulk
    ),
    effect: effectFormula(level, mergedPlayer),
    maxed: level.greaterThanOrEqualTo(maxLevel)
  };

  return applyCachedRepeatableUpgrade(
    cachedPlayer,
    repeatableUpgradeId,
    newRepeatableUpgrade
  );
}

function applyRepeatableUpgradeWithBulkAndUpdates(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
  bulkFormula: (repeatableUpgradeData: RepeatableUpgrade) => Decimal
): PartialMergedPlayer {
  const purchased = applyRepeatableUpgradeWithBulk(
    mergedPlayer,
    repeatableUpgradeId,
    bulkFormula
  );
  const updated = createUpdatedCachedRepeatableUpgrade(
    mergedPlayer,
    repeatableUpgradeId
  );

  return {
    player: purchased,
    cachedPlayer: updated
  };
}

export function applyRepeatableUpgradeSingle(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId
): PartialMergedPlayer {
  return applyRepeatableUpgradeWithBulkAndUpdates(
    mergedPlayer,
    repeatableUpgradeId,
    () => createDecimal(1)
  );
}

export function applyRepeatableUpgradeMax(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId
): PartialMergedPlayer {
  return applyRepeatableUpgradeWithBulkAndUpdates(
    mergedPlayer,
    repeatableUpgradeId,
    () => {
      const [bulk] = getRepeatableUpgradeBulkCostAndLevel(
        repeatableUpgradeId,
        mergedPlayer
      );

      return bulk;
    }
  );
}

export function tickAllRepeatableUpgrades(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  const result = copyObject(mergedPlayer);

  for (const [id, upgradeData] of objectEntries(flatRepeatableUpgrades)) {
    const shouldAutobuy = parseValueGetter(upgradeData.autobuy, mergedPlayer);

    if (!shouldAutobuy) {
      continue;
    }

    const purchased = applyRepeatableUpgradeMax(result, id);

    assignMergedPlayer(result, mergeObjects(result, purchased));
  }

  return result;
}

export function applyUpdatedRepeatableUpgrades(
  mergedPlayer: MergedPlayer
): PartialMergedPlayer {
  const result = deepCopy(mergedPlayer, 2);

  for (const id of objectKeys(flatRepeatableUpgrades)) {
    const updated = createUpdatedCachedRepeatableUpgrade(result, id);

    assignCachedPlayerForMergedPlayer(result, updated);
  }

  return result;
}
