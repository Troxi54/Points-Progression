import type { CurrencyId } from "../types";
import currencyConfig from "../data";

export function hasCurrencyName(str: string): str is CurrencyId {
  return str in currencyConfig;
}
