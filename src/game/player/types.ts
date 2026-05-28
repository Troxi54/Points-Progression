import type { PickByKeys, PickSetters } from "@core/types/pick";
import type { GameVersion } from "@core/types/version";
import type { DimensionId } from "@game/dimensions/types";
import type { XagyrosState } from "@game/features/xagyrosStates/types";
import type { RepeatableUpgradeId } from "@game/repeatableUpgrades/types";
import type { ResetLayerId } from "@game/resetLayers/types";
import type { UpgradeContainerId } from "@game/upgrades/types";
import type Decimal from "break_eternity.js";
import type { CachedPlayer } from "./cached/types";
import type { MergedPlayer, PartialMergedPlayer } from "./merged/types";
import type { PlayerSetterName, PlayerState  } from "./store/types";

export interface Player {
  gameVersion: GameVersion;
  lastTick: number;
  offlineOffset: number;
  unspentOfflineTime: number;

  hideBoughtUpgrades: boolean;
  stableProgressBars: boolean;
  exponentialNotation: boolean;
  autosave: boolean;
  saveBeforeUnload: boolean;
  offlineProgressWorks: boolean;
  menuBackgroundBlur: boolean;

  upgrades: Partial<Record<UpgradeContainerId, boolean[]>>;
  repeatableUpgrades: Partial<Record<RepeatableUpgradeId, Decimal>>;
  resetLayers: Partial<Record<ResetLayerId, PartialResetLayerPlayerData>>;

  dimensionId: DimensionId;

  points: Decimal;
  bestPoints: Decimal;
  bestRun: Decimal | null;
  bestPointsOfRun: Decimal;

  tier: Decimal;
  madeTierTimes: Decimal;
  ampliflux: Decimal;

  vermytes: Decimal;
  bestVermytes: Decimal;
  vermora: Decimal;
  enteredAmplivault: boolean;
  amplivaultLevel: Decimal;
  bestSoftcapperLevel: Decimal;

  energyReactors: Decimal;
  energy: Decimal;
  everReachedCores: boolean;
  everMadeCoreReset: boolean;
  cores: Decimal;
  darkEnergy: Decimal;

  madeNullithResets: Decimal;
  reachedBreakAmplivault: boolean;
  amplivaultBroken: boolean;
  nullionInput: string;
  nullions: Decimal;
  everEnteredSliph: boolean;
  dertoints: Decimal;
  mallirtTotalDertoints: Decimal;
  everReachedCappergy: boolean;
  cappergy: Decimal;
  score: Decimal;
  XP: Decimal;
  nux: Decimal;
  everTriggeredNuxar: boolean;
  nexusLevel: Decimal;
  bestNexusLevel: Decimal;
  amplivoid: Decimal;
  xagytes: Decimal;
  xagyrosStates: XagyrosState[];
  xagoraDertoints: Decimal;
  xagoraPoints: Decimal;
  xagoraNullithResets: Decimal;
  xagoraNux: Decimal;
}

export interface ResetLayerPlayerData {
  everPerformed: boolean;
  isFirstReset: boolean;
  startedDate: number | null;
  autoEnabled: boolean;
  resetsPerSecond: number;
}

export type PartialResetLayerPlayerData = Partial<ResetLayerPlayerData>;

export type PartialPlayer = Partial<Player>;

export type UsePlayerFieldsReturn<
  KP extends readonly (keyof Player)[] | undefined,
  KC extends readonly (keyof CachedPlayer)[] | undefined,
  S extends readonly PlayerSetterName[] | undefined,
> = PickByKeys<Player, KP> & PickByKeys<CachedPlayer, KC> & PickSetters<S>;

export type PlayerLike =
  | Player
  | PartialPlayer
  | PartialMergedPlayer
  | PlayerState
  | undefined;

export type ValueGetter<T, P extends unknown[] = []> =
  | T
  | ((mergedPlayer: MergedPlayer, ...args: P) => T);
export type BooleanGetter = ValueGetter<boolean>;

export type MinifiedPlayer = (Player[keyof Player] | null)[];
