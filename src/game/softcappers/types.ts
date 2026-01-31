import { CurrencyId } from "@/game/currencies/types";
import { DecimalSoftcapMode } from "@/core/types/decimal";
import { Optional } from "@/core/types/partial";
import { ValueGetter } from "@/game/player/types";
import Decimal from "break_eternity.js";

export default interface SoftcapperData {
  startsAt: ValueGetter<Decimal>;
  power: ValueGetter<Decimal>;
  mode: DecimalSoftcapMode;
}

type OptionalProps = "mode";

export type PartialSoftcapperData = Optional<SoftcapperData, OptionalProps>;
export type MissingSoftcapperData = Pick<SoftcapperData, OptionalProps>;

export type SoftcapperDataContainer = Partial<
  Record<CurrencyId, SoftcapperData[]>
>;
export type PartialSoftcapperDataContainer = Partial<
  Record<CurrencyId, PartialSoftcapperData[]>
>;
