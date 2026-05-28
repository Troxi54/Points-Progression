import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import DimensionLayerLayout from "@ui/components/base/DimensionLayerLayout";
import Sliph from "@ui/components/game/buttons/Sliph";
import DertointUpgrade from "@ui/components/game/repeatableUpgrades/DertointUpgrade";
import MallirtBar from "@ui/components/game/resetLayers/MallirtBar";
import Cappergy from "@ui/components/game/states/Cappergy";
import Dertoints from "@ui/components/game/states/Dertoints";
import SliphTimeSpent from "@ui/components/game/states/SliphTimeSpent";
import AutoMallirtButton from "@ui/components/game/toggles/AutoMallirtButton";
import DertointUpgrades from "@ui/components/game/upgrades/DertointUpgrades";
import MallirtUpgrades from "@ui/components/game/upgrades/MallirtUpgrades";
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
