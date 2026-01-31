import { MergedPlayer } from "@/game/player/merged/types";
import { parseValueGetter } from "@/game/player/utils";
import {
  RepeatableUpgrade,
  RepeatableUpgradeId
} from "@/game/repeatableUpgrades/types";
import Decimal, { DecimalSource } from "break_eternity.js";
import { getRepeatableUpgradeData, getRepeatableUpgradeLevel } from "./get";
import { calculateBulk } from "@/core/utils/level";
import createDecimal from "@core/utils/decimal";

export function calculateRepeatableUpgradeCost(
  repeatableUpgrade: RepeatableUpgrade,
  level: DecimalSource
): Decimal {
  return repeatableUpgrade.startCost.multiply(
    Decimal.pow(repeatableUpgrade.costScaling, level)
  );
}

export function getRepeatableUpgradeMaxLevel(
  mergedPlayer: MergedPlayer,
  repeatableUpgrade: RepeatableUpgrade
): Decimal {
  return parseValueGetter(repeatableUpgrade.maxLevel, mergedPlayer);
}

export function calculateRepeatableUpgradeBulkWithMax(
  mergedPlayer: MergedPlayer,
  repeatableUpgrade: RepeatableUpgrade,
  level: Decimal,
  bulk: Decimal
): Decimal {
  const maxLevel = getRepeatableUpgradeMaxLevel(
    mergedPlayer,
    repeatableUpgrade
  );

  const newLevel = level.plus(bulk);
  const difference = newLevel.minus(maxLevel);

  if (difference.lessThanOrEqualTo(0)) {
    return bulk;
  }

  return bulk.minus(difference).max(0);
}

export function calculateRepeatableUpgradeBulk(
  mergedPlayer: MergedPlayer,
  repeatableUpgrade: RepeatableUpgrade,
  currencyValue: Decimal,
  cost: Decimal
): Decimal {
  const condition = parseValueGetter(repeatableUpgrade.condition, mergedPlayer);
  if (!condition) return createDecimal(0);

  return calculateBulk(currencyValue, cost, repeatableUpgrade.costScaling);
}

export function getRepeatableUpgradeBulkCostAndLevel(
  repeatableUpgradeId: RepeatableUpgradeId,
  mergedPlayer: MergedPlayer
): [Decimal, Decimal, Decimal] {
  const upgradeData = getRepeatableUpgradeData(repeatableUpgradeId);

  const { player } = mergedPlayer;

  const { currency } = upgradeData;
  const currencyValue = player[currency];

  const level = getRepeatableUpgradeLevel(player, repeatableUpgradeId);
  const cost = calculateRepeatableUpgradeCost(upgradeData, level);
  const bulk = calculateRepeatableUpgradeBulk(
    mergedPlayer,
    upgradeData,
    currencyValue,
    cost
  );

  return [bulk, cost, level];
}

export function calculateRepeatableUpgradeEffectByData(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
  data: RepeatableUpgrade
): Decimal {
  const level = getRepeatableUpgradeLevel(
    mergedPlayer.player,
    repeatableUpgradeId
  );
  return data.effectFormula(level, mergedPlayer);
}

export function calculateRepeatableUpgradeEffect(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId
) {
  const data = getRepeatableUpgradeData(repeatableUpgradeId);
  return calculateRepeatableUpgradeEffectByData(
    mergedPlayer,
    repeatableUpgradeId,
    data
  );
}
