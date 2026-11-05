import * as z from "@zod/mini";

export const DimensionIdSchema = z.enum(["normal", "sliph"]);

export type DimensionId = z.infer<typeof DimensionIdSchema>;
