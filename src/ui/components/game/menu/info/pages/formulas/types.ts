import type { BooleanGetter, ValueGetter } from "@game/player/types";
import type { ReactNode } from "react";

export interface MenuInfoFormula {
  condition: BooleanGetter;
  name: string;
  node: ValueGetter<ReactNode>;
}

export type MenuInfoFormulaContainer = MenuInfoFormula[];
