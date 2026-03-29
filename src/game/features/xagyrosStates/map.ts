import { XagyrosState } from "./types";
import { CurrencyId } from "@game/currencies/types";

const xagyrosStateCurrencyMap = {
  dertoints: "xagoraDertoints",
  points: "xagoraPoints",
  nullithResets: "xagoraNullithResets",
  nux: "xagoraNux",
} as const satisfies Record<XagyrosState, CurrencyId>;

export default xagyrosStateCurrencyMap;
