import type { CurrencyId } from "../types";
import currencyData from "../data";

export function hasCurrencyName(str: string): str is CurrencyId {
  return str in currencyData;
}
