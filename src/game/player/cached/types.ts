import { CurrencyId } from "@/game/currencies/types";
import { ResetLayerId } from "@/game/resetLayers/types";
import { PartialMergedPlayer } from "@/game/player/merged/types";
import { PlayerState } from "@/game/player/store/types";
import { RepeatableUpgradeId } from "@/game/repeatableUpgrades/types";
import Decimal from "break_eternity.js";

export interface CachedPlayer {
  lastSave: number;
  lastTickSession: number;
  timeSpeed: number;

  repeatableUpgrades: Partial<{
    [K in RepeatableUpgradeId]: CachedRepeatableUpgrade;
  }>;
  resetLayers: Partial<Record<ResetLayerId, CachedResetLayer>>;
  resetsAccumulator: number;
  currencies: Partial<Record<CurrencyId, CachedCurrency>>;
  highestResetDuration: number;
  gameProgress: Decimal;

  ticksPerSecond: number;

  offlineProgress: boolean;
  offlineProgressFullTime: number;
  offlineProgressTicksCompleted: number;
  offlineProgressSpeed: number;
  offlineProgressStartedDate: number | null;
  offlineProgressLastTick: number;

  runEffect: Decimal;
  runDertointEffect: Decimal;
  bestPointsOfRunEffect: Decimal;
  bestPointsOfRunVermoraEffect: Decimal;
  tierRequirement: Decimal;
  tierEffect: Decimal;
  tierVermyteEffect: Decimal;
  bestVermytesEffect: Decimal;
  bestVermytesPointsEffect: Decimal;
  amplivaultRequirement: Decimal;
  amplivaultEffect: Decimal;
  softcapperLevel: Decimal;
  nullionInputConverted: Decimal;
  firstDertointUpgradeEffect: Decimal;

  level: Decimal;
  XPForThisLevel: Decimal;
  XPForNextLevel: Decimal;
  levelDertointEffect: Decimal;

  nexusCost: Decimal | null;
}

export interface CachedRepeatableUpgrade {
  cost: Decimal;
  effect: Decimal;
  bulk: Decimal;
  maxed: boolean;
}

export interface CachedResetLayer {
  duration: number | null;
  lastResetDuration: number | null;
}

export interface CachedCurrency {
  gain: Decimal;
  passiveGain: Decimal;
  effect: Decimal | Partial<Record<CurrencyId, Decimal>>;
}

export type CachedPlayerLike =
  | CachedPlayer
  | Partial<CachedPlayer>
  | PartialMergedPlayer
  | PlayerState
  | undefined;

export type PartialCachedPlayer = Partial<CachedPlayer>;
