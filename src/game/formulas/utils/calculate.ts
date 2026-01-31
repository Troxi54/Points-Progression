import createDecimal from "@/core/utils/decimal";
import { DecimalSource } from "break_eternity.js";

export function calculateGeneration(values: [boolean, DecimalSource][]) {
  let multiplier = createDecimal(0);
  for (const v of values) {
    if (!v[0]) continue;
    else {
      multiplier = createDecimal(v[1]);
      break;
    }
  }
  return multiplier.dividedBy(100);
}
