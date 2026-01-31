import { PickByKeys, PickSetters } from "@/core/types/pick";
import Decimal from "break_eternity.js";
import { PlayerSetterName } from "./store/types";
import { PlayerState } from "./store/types";
import { UpgradeContainerId } from "@/game/upgrades/types";
import { RepeatableUpgradeId } from "@/game/repeatableUpgrades/types";
import { CachedPlayer } from "./cached/types";
import { ResetLayerId } from "@/game/resetLayers/types";
import { GameVersion } from "@/core/config/types";
import { DimensionId } from "@/game/dimensions/types";
import { MergedPlayer, PartialMergedPlayer } from "./merged/types";

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

  upgrades: Partial<Record<UpgradeContainerId, boolean[]>>;
  repeatableUpgrades: Partial<Record<RepeatableUpgradeId, Decimal>>;
  resetLayers: Partial<Record<ResetLayerId, ResetLayerPlayerData>>;

  dimensionId: DimensionId;

  points: Decimal;
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
  XP: Decimal;
  nux: Decimal;
  everTriggeredNuxar: boolean;
  nexusLevel: Decimal;
  bestNexusLevel: Decimal;
  amplivoid: Decimal;
}

export interface ResetLayerPlayerData {
  everPerformed: boolean;
  startedDate: number | null;
  autoEnabled: boolean;
  resetsPerSecond: number;
}

export type PartialPlayer = Partial<Player>;

export type UsePlayerFieldsReturn<
  KP extends readonly (keyof Player)[] | undefined,
  KC extends readonly (keyof CachedPlayer)[] | undefined,
  S extends readonly PlayerSetterName[] | undefined
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
