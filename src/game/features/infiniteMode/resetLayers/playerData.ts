import { ResetLayerPlayerDataBaseSchema } from "@game/resetLayers/playerData";
import * as z from "@zod/mini";

export const InfiniteModeResetLayerPlayerDataSchema = z.omit(
  ResetLayerPlayerDataBaseSchema,
  {
    everPerformed: true,
    isFirstReset: true,
    resetsPerSecond: true,
    offlineResetsPerSecond: true,
  },
);

export type InfiniteModeResetLayerPlayerData = z.infer<
  typeof InfiniteModeResetLayerPlayerDataSchema
>;
