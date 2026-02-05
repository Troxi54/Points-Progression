import Decimal from "break_eternity.js";

export type Keys<K, T> = {
  [P in keyof K]: K[P] extends T ? P : never;
}[keyof K];

export type DecimalKeys<T> = Keys<T, Decimal>;
export type BooleanKeys<T> = Keys<T, boolean>;
