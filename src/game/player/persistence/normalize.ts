import { getDefaultPlayer } from "@/game/player/default";
import { PartialPlayer, Player } from "@/game/player/types";
import {
  getDefaultRepeatableUpgradeLevel,
  getDefaultResetLayerPlayerData,
} from "@/game/player/default";
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
  if (decimalValue.isNan() || !decimalValue.isFinite())
    return createDecimal(0);

  return decimalValue;
}

function parseOptionalDecimalValue(value: unknown): Decimal | null | undefined {
  if (value === null) return null;
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !isDecimal(value)
  ) {
    return;
  }

  const decimalValue = createDecimal(value);
  if (
    decimalValue.isNan() ||
    !decimalValue.isFinite() ||
    decimalValue.lessThanOrEqualTo(0)
  ) {
    return null;
  }

  return decimalValue;
}

function parseFiniteNumberValue<T, O>(
  defaultValue: T,
  value: O
): number | undefined {
  if (typeof defaultValue !== "number") return;

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : isDecimal(value)
          ? value.toNumber()
          : NaN;

  if (!Number.isFinite(parsed)) return 0;
  return parsed;
}

function parseResetLayersValue(
  value: unknown
): Player["resetLayers"] | undefined {
  if (typeof value !== "object" || value === null) return;

  const defaultResetLayer = getDefaultResetLayerPlayerData();
  const parsed: Record<string, typeof defaultResetLayer> = {};

  for (const [id, rawData] of Object.entries(value)) {
    if (typeof rawData !== "object" || rawData === null) continue;

    const resetLayerData = rawData as Partial<typeof defaultResetLayer>;

    const startedDateRaw = resetLayerData.startedDate;
    const startedDate =
      typeof startedDateRaw === "number"
        ? startedDateRaw
        : typeof startedDateRaw === "string"
          ? Number(startedDateRaw)
          : NaN;

    const resetsPerSecondRaw = resetLayerData.resetsPerSecond;
    const resetsPerSecondNumber =
      typeof resetsPerSecondRaw === "number"
        ? resetsPerSecondRaw
        : typeof resetsPerSecondRaw === "string"
          ? Number(resetsPerSecondRaw)
          : NaN;

    parsed[id] = {
      everPerformed:
        typeof resetLayerData.everPerformed === "boolean"
          ? resetLayerData.everPerformed
          : defaultResetLayer.everPerformed,
      startedDate:
        Number.isFinite(startedDate) && startedDate > 0 ? startedDate : null,
      autoEnabled:
        typeof resetLayerData.autoEnabled === "boolean"
          ? resetLayerData.autoEnabled
          : defaultResetLayer.autoEnabled,
      resetsPerSecond:
        Number.isFinite(resetsPerSecondNumber) && resetsPerSecondNumber >= 0
          ? resetsPerSecondNumber
          : 0,
    };
  }

  return parsed as Player["resetLayers"];
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

    const parsedNumber = parseFiniteNumberValue(defaultValue, value);
    if (parsedNumber !== undefined) {
      (result[key] as any) = parsedNumber;
      continue;
    }

    const parsedDecimal = parseDecimalValue(defaultValue, value);
    if (parsedDecimal) {
      (result[key] as any) = parsedDecimal;
      continue;
    }

    if (key === "bestRun") {
      (result[key] as any) = parseOptionalDecimalValue(value) ?? null;
      continue;
    }

    if (key === "resetLayers") {
      const parsedResetLayers = parseResetLayersValue(value);
      if (parsedResetLayers) {
        (result[key] as any) = parsedResetLayers;
      }
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
