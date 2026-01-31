import Decimal from "break_eternity.js";

export type DecimalKeys<T> = {
  [K in keyof T]: T[K] extends Decimal ? K : never;
}[keyof T];
export type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];
