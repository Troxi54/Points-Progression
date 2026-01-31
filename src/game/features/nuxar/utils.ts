import { calculateCurrencyGain } from "@/game/currencies/utils/calculate";
import { getPlayerState } from "@/game/player/store/store";
import nuxarConfig from "./config";
import Decimal from "break_eternity.js";

export function triggerNuxar() {
  const { player, mergedPlayer, setPlayer } = getPlayerState();

  if (player.nullions.lessThan(nuxarConfig.requirement)) return;

  const nuxGain = calculateCurrencyGain(mergedPlayer, "nux");

  setPlayer({
    nux: player.nux.plus(nuxGain),
    nullions: player.nullions.multiply(
      Decimal.minus(1, nuxarConfig.nullionLoss)
    ),
    everTriggeredNuxar: true
  });
}
