import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import MallirtBar from "@/ui/components/progressBars/MallirtBar";
import DertointUpgrade from "@/ui/components/repeatableUpgrades/DertointUpgrade";
import Cappergy from "@/ui/components/states/Cappergy";
import Dertoints from "@/ui/components/states/Dertoints";
import SliphTimeSpent from "@/ui/components/states/SliphTimeSpent";
import AutoMallirtButton from "@/ui/components/toggles/AutoMallirtButton";
import DertointUpgrades from "@/ui/components/upgrades/DertointUpgrades";
import MallirtUpgrades from "@/ui/components/upgrades/MallirtUpgrades";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import Sliph from "@ui/components/buttons/Sliph";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function SliphDimensionLayer1() {
  const state = usePlayerFields(
    {
      player: ["everReachedCappergy"],
    },
    {
      additionalSelectors: (state) =>
        everPerformedResetLayers(state, ["mallirt"]),
    },
  );

  return (
    <DimensionLayerLayout>
      <Sliph />
      <SliphTimeSpent />
      <Dertoints />
      <DertointUpgrade />
      <DertointUpgrades />
      <MallirtBar />
      {state.resetLayer_mallirt_everPerformed && (
        <>
          <AutoMallirtButton />
          <MallirtUpgrades />
        </>
      )}
      {state.everReachedCappergy && <Cappergy />}
    </DimensionLayerLayout>
  );
}

export default SliphDimensionLayer1;
