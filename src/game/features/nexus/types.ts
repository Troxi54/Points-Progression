import type { ValueGetter } from "@game/player/types";
import type { DecimalSource } from "break_eternity.js";
import type { ReactNode } from "react";

interface NexusMilestone {
  cost: DecimalSource;
  description: ValueGetter<ReactNode>;
}

export type NexusMilestoneContainer = NexusMilestone[];

export type NexusLevelSelection<T extends string> = `hasNexusLevel${T}`;
