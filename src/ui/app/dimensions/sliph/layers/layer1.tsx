import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import Layer from "@ui/components/features/Layer";
import SliphToggle from "@ui/components/game/buttons/SliphToggle";
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
    <Layer>
      <SliphToggle />
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
    </Layer>
  );
}

export default SliphDimensionLayer1;
