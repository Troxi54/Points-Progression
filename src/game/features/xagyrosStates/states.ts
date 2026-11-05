import * as z from "@zod/mini";

export const XagyrosStateSchema = z.enum([
  "dertoints",
  "points",
  "nullithResets",
  "nux",
]);

export type XagyrosState = z.infer<typeof XagyrosStateSchema>;
