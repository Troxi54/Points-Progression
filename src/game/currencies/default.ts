import { CurrencyData, CurrencyEffectData } from "./types";

export default function getDefaultCurrencyData(): CurrencyData {
  return {
    dimensionId: "normal",
    layer: null,
    name: undefined,
    affects: null,
    effectMode: "multiply",
    passiveGainWorks: false,
    effectWorks: true
  };
}

export function getDefaultCurrencyEffectData(): CurrencyEffectData {
  return {
    mode: "multiply",
    works: true
  };
}
