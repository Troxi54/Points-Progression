import type { DimensionId } from "@game/dimensions/ids";
import { getCurrentGameTime } from "@core/utils/gameTime";
import { isDimension } from "@game/dimensions/utils/compare";
import { getPlayerState } from "@game/player/store";
import { getResetLayerPlayerData } from "@game/resetLayers/utils/get";
import { setResetLayerPlayerData } from "@game/resetLayers/utils/set";
import { hasUpgradeById } from "@game/upgrades/utils/has";

export function toggleSliph() {
  const { player, setPlayer } = getPlayerState();

  if (!player.enteredAmplivault && !hasUpgradeById(player, "nullith_5")) return;

  const { dimensionId } = player;
  const newValue: DimensionId = isDimension(dimensionId, "sliph")
    ? "normal"
    : "sliph";

  const isSliph = isDimension(newValue, "sliph");

  const mallirtStartedDate = getResetLayerPlayerData(
    player,
    "mallirt",
  ).startedDate;

  setPlayer((player) => {
    player.dimensionId = newValue;

    if (isSliph) {
      if (!player.everEnteredSliph) {
        player.everEnteredSliph = true;
      }

      if (mallirtStartedDate === null) {
        setResetLayerPlayerData(player, "mallirt", {
          startedDate: getCurrentGameTime(),
        });
      }
    }
  });
}
