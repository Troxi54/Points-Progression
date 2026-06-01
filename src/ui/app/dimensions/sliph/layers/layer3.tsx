import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import Layer from "@ui/components/features/Layer";
import XagyrosStatesComponent from "@ui/components/game/buttons/xagyros/XagyrosStates";
import XagyrosBar from "@ui/components/game/resetLayers/XagyrosBar";
import AutoXagyrosButton from "@ui/components/game/toggles/AutoXagyrosButton";
import XagyrosUpgrades from "@ui/components/game/upgrades/XagyrosUpgrades";
import { usePlayer } from "@ui/hooks/usePlayer/main";

function SliphDimensionLayer3() {
  const state = usePlayer((state) => {
    const resetLayers = everPerformedResetLayers(state, ["xagyros"]);
    const upgrades = hasUpgrades(state, {
      level: [4],
    } as const);

    return mergeObjects(resetLayers, upgrades);
  });

  if (!(state.level_4 || state.resetLayer_xagyros_everPerformed)) return null;

  return (
    <Layer>
      <XagyrosBar />
      {state.resetLayer_xagyros_everPerformed && (
        <>
          <AutoXagyrosButton />
          <XagyrosStatesComponent />
          <XagyrosUpgrades />
        </>
      )}
    </Layer>
  );
}

export default SliphDimensionLayer3;
