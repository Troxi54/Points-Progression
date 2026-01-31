import { ValueGetter } from "@/game/player/types";
import { DecimalSource } from "break_eternity.js";
import { ReactNode } from "react";

interface NexusMilestone {
  cost: DecimalSource;
  description: ValueGetter<ReactNode>;
}

export type NexusMilestoneContainer = NexusMilestone[];
