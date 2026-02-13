import { calculateCurrencyGain } from "@/game/currencies/utils/calculate";
import { getPlayerState } from "@/game/player/store/store";
import { Player } from "@/game/player/types";
import createDecimal from "@/core/utils/decimal";
import { clamp } from "@/core/utils/number";

export function parseNullionInput(player: Player) {
  let result = createDecimal(0);

  const input = player.nullionInput;
  if (input.includes("%")) {
    let percent = Number(input.slice(0, -1));
    if (!isNaN(percent)) {
      percent = clamp(percent, 0, 100);
      result = player.madeNullithResets.multiply(percent / 100);
    }
  } else {
    const decimal = createDecimal(input);
    if (!decimal.isNan() && decimal.greaterThanOrEqualTo(0)) {
      result = decimal;
    }
  }

  if (result.greaterThan(player.madeNullithResets)) {
    result = player.madeNullithResets;
  }

  return result;
}

export function triggerNullifice() {
  const { player, mergedPlayer, cachedPlayer, setPlayer } = getPlayerState();

  const gain = calculateCurrencyGain(mergedPlayer, "nullions");

  if (
    cachedPlayer.nullionInputConverted.greaterThan(player.madeNullithResets) ||
    gain.lessThanOrEqualTo(0)
  )
    return;

  setPlayer({
    nullions: player.nullions.plus(gain),
    madeNullithResets: player.madeNullithResets.minus(
      cachedPlayer.nullionInputConverted,
    ),
  });
}
