import type { XagyrosState } from "@game/features/xagyrosStates/states";
import gameConfig from "@core/config/data";
import { NumberNotationSchema } from "@core/format/numberNotation";
import { DecimalSchema, DecimalWithDefaultSchema } from "@core/schemas/decimal";
import { GameVersionSchema } from "@core/schemas/version";
import { copyObject } from "@core/utils/object";
import { getCurrentTime } from "@core/utils/time";
import { DimensionIdSchema } from "@game/dimensions/ids";
import { InfiniteModeResetLayerPlayerDataSchema } from "@game/features/infiniteMode/resetLayers/playerData";
import { XagyrosStateSchema } from "@game/features/xagyrosStates/states";
import { RepeatableUpgradeIdSchema } from "@game/repeatableUpgrades/ids";
import { ResetLayerIdSchema } from "@game/resetLayers/ids";
import {
  getDefaultResetLayerPlayerData,
  ResetLayerPlayerDataSchema,
} from "@game/resetLayers/playerData";
import { UpgradeContainerIdSchema } from "@game/upgrades/ids";
import * as z from "@zod/mini";

export const PlayerSchema = z.object({
  gameVersion: z.catch(GameVersionSchema, () =>
    copyObject(gameConfig.gameVersion),
  ),

  lastTick: z.catch(z.number(), () => getCurrentTime()),
  offlineOffset: z.catch(z.number(), 0),
  unspentOfflineTime: z.catch(z.number(), 0),

  hideBoughtUpgrades: z.catch(z.boolean(), false),
  stableProgressBars: z.catch(z.boolean(), true),
  numberNotation: z.catch(NumberNotationSchema, "standard"),
  autosave: z.catch(z.boolean(), true),
  saveBeforeUnload: z.catch(z.boolean(), true),
  offlineProgressWorks: z.catch(z.boolean(), true),
  menuBackgroundBlur: z.catch(z.boolean(), true),

  upgrades: z.catch(
    z.partialRecord(UpgradeContainerIdSchema, z.array(z.boolean())),
    {},
  ),

  repeatableUpgrades: z.catch(
    z.partialRecord(RepeatableUpgradeIdSchema, DecimalWithDefaultSchema),
    {},
  ),

  resetLayers: z.catch(
    z.partialRecord(ResetLayerIdSchema, ResetLayerPlayerDataSchema),
    () => ({
      reset: getDefaultResetLayerPlayerData(),
    }),
  ),

  dimensionId: z.catch(DimensionIdSchema, "normal"),
  enteredInfiniteMode: z.catch(z.boolean(), false),

  infiniteMode: z.catch(
    z.object({
      layers: z.catch(
        z.array(
          z.object({
            resetLayer: InfiniteModeResetLayerPlayerDataSchema,
            bestRun: z.nullable(z.number()),
            currency: DecimalWithDefaultSchema,
            repeatableUpgradeLvl: DecimalWithDefaultSchema,
            upgrades: z.array(z.boolean()),
          }),
        ),
        () => [],
      ),
    }),
    () => ({ layers: [] }),
  ),

  points: DecimalWithDefaultSchema,
  bestPoints: DecimalWithDefaultSchema,
  bestRun: z.catch(z.nullable(DecimalSchema), null),
  bestPointsOfRun: DecimalWithDefaultSchema,

  tier: DecimalWithDefaultSchema,
  madeTierTimes: DecimalWithDefaultSchema,
  ampliflux: DecimalWithDefaultSchema,

  vermytes: DecimalWithDefaultSchema,
  bestVermytes: DecimalWithDefaultSchema,
  vermora: DecimalWithDefaultSchema,
  enteredAmplivault: z.catch(z.boolean(), false),
  amplivaultLevel: DecimalWithDefaultSchema,
  bestSoftcapperLevel: DecimalWithDefaultSchema,

  energyReactors: DecimalWithDefaultSchema,
  energy: DecimalWithDefaultSchema,
  everReachedCores: z.catch(z.boolean(), false),
  everMadeCoreReset: z.catch(z.boolean(), false),
  cores: DecimalWithDefaultSchema,
  darkEnergy: DecimalWithDefaultSchema,

  madeNullithResets: DecimalWithDefaultSchema,
  reachedBreakAmplivault: z.catch(z.boolean(), false),
  amplivaultBroken: z.catch(z.boolean(), false),
  nullionInput: z.catch(z.string(), ""),
  nullions: DecimalWithDefaultSchema,
  everEnteredSliph: z.catch(z.boolean(), false),
  dertoints: DecimalWithDefaultSchema,
  mallirtTotalDertoints: DecimalWithDefaultSchema,
  everReachedCappergy: z.catch(z.boolean(), false),
  cappergy: DecimalWithDefaultSchema,

  score: DecimalWithDefaultSchema,
  XP: DecimalWithDefaultSchema,
  nux: DecimalWithDefaultSchema,
  everTriggeredNuxar: z.catch(z.boolean(), false),
  nexusLevel: DecimalWithDefaultSchema,
  bestNexusLevel: DecimalWithDefaultSchema,
  amplivoid: DecimalWithDefaultSchema,

  xagytes: DecimalWithDefaultSchema,
  xagyrosStates: z.catch(
    z.array(XagyrosStateSchema),
    () => ["dertoints"] satisfies XagyrosState[],
  ),
  xagoraDertoints: DecimalWithDefaultSchema,
  xagoraPoints: DecimalWithDefaultSchema,
  xagoraNullithResets: DecimalWithDefaultSchema,
  xagoraNux: DecimalWithDefaultSchema,

  enteredAntinefit: z.catch(z.boolean(), false),
  everEnteredAntinefit: z.catch(z.boolean(), false),
  everLeftAntinefit: z.catch(z.boolean(), false),
  antiPoints: DecimalWithDefaultSchema,
  beneflux: DecimalWithDefaultSchema,
});

export type Player = z.infer<typeof PlayerSchema>;

export function getDefaultPlayer(): Player {
  return PlayerSchema.parse({});
}

export const requiredPlayerProps = new Set<keyof Player>([
  "gameVersion",
  "lastTick",
]);
