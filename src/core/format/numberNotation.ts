import * as z from "@zod/mini";

export const NumberNotationSchema = z.enum([
  "standard",
  "legacy",
  "scientific",
]);

export type NumberNotation = z.infer<typeof NumberNotationSchema>;
