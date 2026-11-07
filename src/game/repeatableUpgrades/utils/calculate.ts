import type { MergedPlayer } from "@game/player/merged/types";
import type {
  RepeatableUpgradeBaseConfig,
  RepeatableUpgradeConfig,
} from "@game/repeatableUpgrades/types";
import type { DecimalSource } from "break_eternity.js";
import type { RepeatableUpgradeId } from "../ids";
import { calculateBulk, clampBulk } from "@core/utils/bulk";
import createDecimal from "@core/utils/decimal";
import { parseValueGetter } from "@game/player/utils";
import Decimal from "break_eternity.js";
import { getRepeatableUpgradeConfig, getRepeatableUpgradeLevel } from "./get";

export function calculateRepeatableUpgradeCost(
  repeatableUpgrade: RepeatableUpgradeBaseConfig,
  level: DecimalSource,
): Decimal {
  return repeatableUpgrade.startCost.multiply(
    Decimal.pow(repeatableUpgrade.costScaling, level),
  );
}

export function getRepeatableUpgradeMaxLevel(
  mergedPlayer: MergedPlayer,
  repeatableUpgrade: RepeatableUpgradeBaseConfig,
) {
  return parseValueGetter(repeatableUpgrade.maxLevel, mergedPlayer);
}

export function calculateRepeatableUpgradeBulk(
  mergedPlayer: MergedPlayer,
  repeatableUpgrade: RepeatableUpgradeBaseConfig,
  currencyValue: Decimal,
  level: Decimal,
  cost: Decimal,
): Decimal {
  const condition = parseValueGetter(repeatableUpgrade.condition, mergedPlayer);
  if (!condition) return createDecimal(0);

  const bulk = calculateBulk(
    currencyValue,
    cost,
    repeatableUpgrade.costScaling,
  );

  const maxLevel = getRepeatableUpgradeMaxLevel(
    mergedPlayer,
    repeatableUpgrade,
  );

  return clampBulk(bulk, level, maxLevel);
}

export function getRepeatableUpgradeBulkCostAndLevel(
  repeatableUpgradeId: RepeatableUpgradeId,
  mergedPlayer: MergedPlayer,
): [Decimal, Decimal, Decimal] {
  const upgradeConfig = getRepeatableUpgradeConfig(repeatableUpgradeId);

  const { player } = mergedPlayer;

  const { currency } = upgradeConfig;
  const currencyValue = player[currency];

  const level = getRepeatableUpgradeLevel(player, repeatableUpgradeId);
  const cost = calculateRepeatableUpgradeCost(upgradeConfig, level);
  const bulk = calculateRepeatableUpgradeBulk(
    mergedPlayer,
    upgradeConfig,
    currencyValue,
    level,
    cost,
  );

  return [bulk, cost, level];
}

export function calculateRepeatableUpgradeEffectByData(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
  data: RepeatableUpgradeConfig,
): Decimal {
  const level = getRepeatableUpgradeLevel(
    mergedPlayer.player,
    repeatableUpgradeId,
  );
  return data.effectFormula(level, mergedPlayer);
}

export function calculateRepeatableUpgradeEffect(
  mergedPlayer: MergedPlayer,
  repeatableUpgradeId: RepeatableUpgradeId,
) {
  const data = getRepeatableUpgradeConfig(repeatableUpgradeId);
  return calculateRepeatableUpgradeEffectByData(
    mergedPlayer,
    repeatableUpgradeId,
    data,
  );
}
