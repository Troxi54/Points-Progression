import type { CurrencyConfig, CurrencyEffectData } from "./types";

export default function getDefaultCurrencyConfig(): CurrencyConfig {
  return {
    dimensionId: "normal",
    layer: null,
    name: undefined,
    affects: null,
    effectMode: "multiply",
    passiveGainWorks: false,
    effectWorks: true,
  };
}

export function getDefaultCurrencyEffectData(): CurrencyEffectData {
  return {
    works: true,
  };
}
