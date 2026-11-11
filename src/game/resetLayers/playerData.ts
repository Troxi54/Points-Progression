import * as z from "@zod/mini";

export const ResetLayerPlayerDataBaseSchema = z.object({
  everPerformed: z.catch(z.boolean(), false),
  isFirstReset: z.catch(z.boolean(), true),
  startedDate: z.catch(z.nullable(z.number()), null),
  autoEnabled: z.catch(z.boolean(), true),
  offlineResetsPerSecond: z.optional(z.catch(z.number(), 0)),
  resetsPerSecond: z.optional(z.number()),
});

export const ResetLayerPlayerDataSchema = z.pipe(
  ResetLayerPlayerDataBaseSchema,
  z.transform(({ resetsPerSecond, ...resetLayer }) => ({
    ...resetLayer,
    offlineResetsPerSecond:
      resetLayer.offlineResetsPerSecond ?? resetsPerSecond,
  })),
);

export type ResetLayerPlayerData = z.infer<typeof ResetLayerPlayerDataSchema>;

export function getDefaultResetLayerPlayerData(): ResetLayerPlayerData {
  return ResetLayerPlayerDataSchema.parse({});
}
