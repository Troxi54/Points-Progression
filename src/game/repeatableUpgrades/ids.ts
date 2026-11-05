import * as z from "@zod/mini";

export const RepeatableUpgradeIdsSchema = z.object({
  normal: z.enum([
    "point",
    "ampliflux",
    "vermyte",
    "core",
    "beneflux",
    "nullith",
  ]),
  sliph: z.enum(["dertoint", "amplivoid"]),
});

export type RepeatableUpgradeIds = z.infer<typeof RepeatableUpgradeIdsSchema>;

export const RepeatableUpgradeIdSchema = z.union(
  Object.values(RepeatableUpgradeIdsSchema.shape),
);

export type RepeatableUpgradeId = z.infer<typeof RepeatableUpgradeIdSchema>;
