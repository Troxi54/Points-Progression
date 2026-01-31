import { DimensionId } from "@/game/dimensions/types";
import { isDimension } from "@/game/dimensions/utils/compare";
import { getPlayerState } from "@/game/player/store/store";
import { applyResetLayerPlayerData } from "@/game/resetLayers/utils/apply";
import { getResetLayerPlayerDataProp } from "@/game/resetLayers/utils/get";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { getCurrentGameTime } from "@/core/utils/time";

export function toggleSliph() {
  const { player, setPlayer } = getPlayerState();

  if (!player.enteredAmplivault && !hasUpgradeById(player, "nullith_5")) return;

  const { dimensionId } = player;
  const newValue: DimensionId = isDimension(dimensionId, "sliph")
    ? "normal"
    : "sliph";

  const isSliph = isDimension(newValue, "sliph");

  const mallirtStartedDate = getResetLayerPlayerDataProp(
    player,
    "mallirt",
    "startedDate"
  );

  setPlayer({
    dimensionId: newValue,
    ...(isSliph && !player.everEnteredSliph ? { everEnteredSliph: true } : {}),
    ...(isSliph && mallirtStartedDate === null
      ? applyResetLayerPlayerData(player, "mallirt", {
          startedDate: getCurrentGameTime()
        })
      : {})
  });
}
