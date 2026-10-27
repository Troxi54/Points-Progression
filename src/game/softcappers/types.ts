import type { DecimalSoftcapMode } from "@core/types/decimal";
import type { Optional } from "@core/types/partial";
import type { CurrencyId } from "@game/currencies/types";
import type { ValueGetter } from "@game/player/types";
import type Decimal from "break_eternity.js";

export default interface SoftcapperConfig {
  startsAt: ValueGetter<Decimal>;
  power: ValueGetter<Decimal>;
  mode: DecimalSoftcapMode;
}

type OptionalProps = "mode";

export type PartialSoftcapperConfig = Optional<SoftcapperConfig, OptionalProps>;
export type MissingSoftcapperConfig = Pick<SoftcapperConfig, OptionalProps>;

export type SoftcapperContainerConfig = Partial<
  Record<CurrencyId, SoftcapperConfig[]>
>;
export type PartialSoftcapperContainerConfig = Partial<
  Record<CurrencyId, PartialSoftcapperConfig[]>
>;
