import { z } from "@zod/mini";

export const UpgradeContainerIdSchema = z.enum([
  "reset",
  "tier",
  "vermyros",
  "nullith",
  "dertoint",
  "mallirt",
  "level",
  "xagyros",
]);

export type UpgradeContainerId = z.infer<typeof UpgradeContainerIdSchema>;
