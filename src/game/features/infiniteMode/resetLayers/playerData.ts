import { ResetLayerPlayerDataSchema } from "@game/resetLayers/playerData";
import * as z from "@zod/mini";

export const InfiniteModeResetLayerPlayerDataSchema = z.omit(
  ResetLayerPlayerDataSchema,
  {
    everPerformed: true,
    isFirstReset: true,
  },
);

export type InfiniteModeResetLayerPlayerData = z.infer<
  typeof InfiniteModeResetLayerPlayerDataSchema
>;
