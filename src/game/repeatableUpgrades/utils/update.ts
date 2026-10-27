import type {
  PartialCachedPlayer,
  CachedRepeatableUpgrade,
} from "@game/player/cached/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { RepeatableUpgradeId } from "../types";
import {
  getRepeatableUpgradeBulkCostAndLevel,
  getRepeatableUpgradeMaxLevel,
  calculateRepeatableUpgradeBulkWithMax,
} from "./calculate";
import { getRepeatableUpgradeConfig } from "./get";
import { setCachedRepeatableUpgrade } from "./set";

export function updateCachedRepeatableUpgrade(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
): PartialCachedPlayer | undefined {
  const upgradeConfig = getRepeatableUpgradeConfig(repeatableUpgradeId);

  const { cachedPlayer } = mergedPlayer;

  const { effectFormula } = upgradeConfig;
  const [bulk, cost, level] = getRepeatableUpgradeBulkCostAndLevel(
    repeatableUpgradeId,
    mergedPlayer,
  );

  const maxLevel = getRepeatableUpgradeMaxLevel(mergedPlayer, upgradeConfig);

  const newRepeatableUpgrade: CachedRepeatableUpgrade = {
    cost,
    bulk: calculateRepeatableUpgradeBulkWithMax(
      mergedPlayer,
      upgradeConfig,
      level,
      bulk,
    ),
    effect: effectFormula(level, mergedPlayer),
    maxed: level.greaterThanOrEqualTo(maxLevel),
  };

  return setCachedRepeatableUpgrade(
    cachedPlayer,
    repeatableUpgradeId,
    newRepeatableUpgrade,
  );
}
