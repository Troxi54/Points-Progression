import type { MergedPlayer } from "@game/player/merged/types";
import type { RepeatableUpgradeId } from "../ids";
import {
  getRepeatableUpgradeBulkCostAndLevel,
  getRepeatableUpgradeMaxLevel,
} from "./calculate";
import { getRepeatableUpgradeConfig } from "./get";

export function updateCachedRepeatableUpgrade(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
) {
  const upgradeConfig = getRepeatableUpgradeConfig(repeatableUpgradeId);

  const { cachedPlayer } = mergedPlayer;

  const { effectFormula } = upgradeConfig;
  const [bulk, cost, level] = getRepeatableUpgradeBulkCostAndLevel(
    repeatableUpgradeId,
    mergedPlayer,
  );

  const maxLevel = getRepeatableUpgradeMaxLevel(mergedPlayer, upgradeConfig);

  cachedPlayer.repeatableUpgrades[repeatableUpgradeId] = {
    cost,
    bulk,
    effect: effectFormula(level, mergedPlayer),
    maxed: maxLevel ? level.greaterThanOrEqualTo(maxLevel) : false,
  };
}
