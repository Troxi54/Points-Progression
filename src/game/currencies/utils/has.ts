import currencyData from "../data";
import { CurrencyId } from "../types";

export function hasCurrencyName(str: string): str is CurrencyId {
  return str in currencyData;
}
