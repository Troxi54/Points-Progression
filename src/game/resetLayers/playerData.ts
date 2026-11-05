import * as z from "@zod/mini";

export const ResetLayerPlayerDataSchema = z.object({
  everPerformed: z.catch(z.boolean(), false),
  isFirstReset: z.catch(z.boolean(), true),
  startedDate: z.catch(z.nullable(z.number()), null),
  autoEnabled: z.catch(z.boolean(), true),
  resetsPerSecond: z.catch(z.number(), 0),
});

export type ResetLayerPlayerData = z.infer<typeof ResetLayerPlayerDataSchema>;

export function getDefaultResetLayerPlayerData(): ResetLayerPlayerData {
  return ResetLayerPlayerDataSchema.parse({});
}
