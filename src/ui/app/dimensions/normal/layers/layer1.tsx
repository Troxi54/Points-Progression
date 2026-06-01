import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import Layer from "@ui/components/features/Layer";
import PointUpgrade from "@ui/components/game/repeatableUpgrades/PointUpgrade";
import ResetBar from "@ui/components/game/resetLayers/ResetBar";
import Points from "@ui/components/game/states/Points";
import TimeSpent from "@ui/components/game/states/TimeSpent";
import AutoResetButton from "@ui/components/game/toggles/AutoResetButton";
import ResetUpgrades from "@ui/components/game/upgrades/ResetUpgrades";

import { usePlayer } from "@ui/hooks/usePlayer/main";

function NormalDimensionLayer1() {
  const state = usePlayer((state) => {
    const resetLayers = everPerformedResetLayers(state, ["reset"]);
    const upgrades = hasUpgrades(state, {
      tier: [4],
    } as const);

    return mergeObjects(resetLayers, upgrades);
  });

  return (
    <Layer>
      <TimeSpent />
      <Points />
      <PointUpgrade />
      <ResetBar />
      {state.resetLayer_reset_everPerformed && (
        <>
          {!state.tier_4 && <AutoResetButton />}
          <ResetUpgrades />
        </>
      )}
    </Layer>
  );
}

export default NormalDimensionLayer1;
