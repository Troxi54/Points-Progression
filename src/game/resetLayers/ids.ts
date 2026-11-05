import * as z from "@zod/mini";

export const ResetLayersIdsSchema = z.object({
  normal: z.enum(["reset", "tier", "vermyros", "nullith"]),
  sliph: z.enum(["mallirt", "level", "xagyros"]),
});

export type ResetLayerIds = z.infer<typeof ResetLayersIdsSchema>;

export const ResetLayerIdSchema = z.union(
  Object.values(ResetLayersIdsSchema.shape),
);

export type ResetLayerId = z.infer<typeof ResetLayerIdSchema>;
