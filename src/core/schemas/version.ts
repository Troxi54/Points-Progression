import * as z from "@zod/mini";

export const GameVersionSchema = z.object({
  major: z.int(),
  minor: z.optional(z.number()),
  patch: z.optional(z.number()),
  subpatch: z.optional(z.number()),
});

export type GameVersion = z.infer<typeof GameVersionSchema>;
