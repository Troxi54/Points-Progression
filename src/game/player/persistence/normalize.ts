import { getDefaultPlayer } from "@/game/player/default";
import { PartialPlayer, Player } from "@/game/player/types";
import { getDefaultRepeatableUpgradeLevel } from "@/game/player/default";
import createDecimal, { isDecimal } from "@/core/utils/decimal";
import { objectEntries } from "@/core/utils/object";
import Decimal from "break_eternity.js";

function parseDecimalValue<T, O>(
  defaultValue: T,
  value: O
): Decimal | undefined {
  if (!isDecimal(defaultValue)) return;
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !isDecimal(value)
  )
    return;

  const decimalValue = createDecimal(value);
  if (decimalValue.isNan() || decimalValue.equals(Infinity))
    return createDecimal(0);

  return decimalValue;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalize(player: PartialPlayer): Player {
  const defaultPlayer = getDefaultPlayer();
  const result: Player & Record<string, any> = { ...defaultPlayer };

  for (const [key, defaultValue] of Object.entries(defaultPlayer) as [
    keyof Player,
    any
  ][]) {
    const value = player[key];
    if (value === undefined) continue;

    const parsedDecimal = parseDecimalValue(defaultValue, value);
    if (parsedDecimal) {
      (result[key] as any) = parsedDecimal;
      continue;
    }

    if (
      key === "repeatableUpgrades" &&
      typeof value === "object" &&
      value !== null
    ) {
      const defaultUpgradeValue = getDefaultRepeatableUpgradeLevel();
      result[key] = {};
      for (const [id, level] of Object.entries(value)) {
        const parsed =
          parseDecimalValue(defaultUpgradeValue, level) ?? createDecimal(0);
        (result[key] as any)[id] = parsed;
      }
      continue;
    }

    (result[key] as any) = value;
  }

  for (const [key, value] of Object.entries(player)) {
    if (!(key in defaultPlayer)) {
      result[key] = value;
    }
  }

  return result as Player;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function normalizePlayer(player: PartialPlayer): Player {
  const normalized = normalize(player);

  return normalized;
}

export function sanitizePlayer(player: PartialPlayer): Player {
  const result = getDefaultPlayer();

  for (const [key, value] of objectEntries(player)) {
    if (!(key in result)) continue;

    (result[key] as unknown) = value;
  }

  return result;
}
