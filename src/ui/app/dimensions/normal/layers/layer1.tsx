import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import ResetBar from "@/ui/components/progressBars/ResetBar";
import PointUpgrade from "@/ui/components/repeatableUpgrades/PointUpgrade";
import Points from "@/ui/components/states/Points";
import TimeSpent from "@/ui/components/states/TimeSpent";
import AutoResetButton from "@/ui/components/toggles/AutoResetButton";
import ResetUpgrades from "@/ui/components/upgrades/ResetUpgrades";
import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
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
    <DimensionLayerLayout>
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
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer1;
