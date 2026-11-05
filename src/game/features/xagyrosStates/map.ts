import type { CurrencyId } from "@game/currencies/types";
import type { XagyrosState } from "./states";

const xagyrosStateCurrencyMap = {
  dertoints: "xagoraDertoints",
  points: "xagoraPoints",
  nullithResets: "xagoraNullithResets",
  nux: "xagoraNux",
} as const satisfies Record<XagyrosState, CurrencyId>;

export default xagyrosStateCurrencyMap;
