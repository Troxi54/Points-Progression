import type { PartialCachedPlayer } from "@game/player/cached/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { CachedRepeatableUpgrade } from "../cachedData";
import type { RepeatableUpgradeId } from "../ids";
import {
  getRepeatableUpgradeBulkCostAndLevel,
  getRepeatableUpgradeMaxLevel,
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
    bulk,
    effect: effectFormula(level, mergedPlayer),
    maxed: maxLevel ? level.greaterThanOrEqualTo(maxLevel) : false,
  };

  return setCachedRepeatableUpgrade(
    cachedPlayer,
    repeatableUpgradeId,
    newRepeatableUpgrade,
  );
}
