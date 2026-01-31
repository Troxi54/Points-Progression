import { DefaultResetLayerData } from "./types";
import createDecimal from "@/core/utils/decimal";

export default function getDefaultResetLayerData(): DefaultResetLayerData {
  return {
    usePlayer: null,
    goal: createDecimal(1e6),
    currency: "points",
    reset: () => ({}),
    preventReset: false,
    canPerform: true,
    reward: () => ({})
  };
}
