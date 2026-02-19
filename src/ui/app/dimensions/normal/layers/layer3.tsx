import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import Amplivault from "@ui/components/buttons/Amplivault";
import CoreButton from "@ui/components/buttons/CoreButton";
import VermyrosBar from "@ui/components/progressBars/VermyrosBar";
import CoreUpgrade from "@ui/components/repeatableUpgrades/CoreUpgrade";
import VermyteUpgrade from "@ui/components/repeatableUpgrades/VermyteUpgrade";
import Cores from "@ui/components/states/Cores";
import DarkEnergy from "@ui/components/states/DarkEnergy";
import Energy from "@ui/components/states/Energy";
import EnergyReactors from "@ui/components/states/EnergyReactors";
import Softcapper from "@ui/components/states/Softcapper";
import Vermora from "@ui/components/states/Vermora";
import Vermytes from "@ui/components/states/Vermytes";
import AutoVermyrosButton from "@ui/components/toggles/AutoVermyrosButton";
import VermyrosUpgrades from "@ui/components/upgrades/VermyrosUpgrades";
import VermyrosUpgrades2 from "@ui/components/upgrades/VermyrosUpgrades2";
import VermyrosUpgrades3 from "@ui/components/upgrades/VermyrosUpgrades3";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function NormalDimensionLayer3() {
  const state = usePlayerFields(
    { player: ["bestSoftcapperLevel", "everMadeCoreReset"] },
    {
      additionalSelectors: (state) => {
        const resetLayers = everPerformedResetLayers(state, [
          "vermyros",
          "nullith",
        ]);
        const upgrades = hasUpgrades(state, {
          tier: [4],
          vermyros: [1, 4, 5, 8, 10],
        } as const);

        return mergeObjects(resetLayers, upgrades);
      },
    },
  );

  const everPerformedVermyros = state.resetLayer_vermyros_everPerformed;

  if (!(state.tier_4 || everPerformedVermyros)) return null;

  const everPerformedNullith = state.resetLayer_nullith_everPerformed;

  return (
    <DimensionLayerLayout>
      <VermyrosBar />
      {everPerformedVermyros && (
        <>
          {!state.vermyros_8 && <AutoVermyrosButton />}
          <Vermora />
          <Vermytes />
          <VermyrosUpgrades />
          {(state.vermyros_1 || everPerformedNullith) && <VermyteUpgrade />}
          {(state.vermyros_4 || everPerformedNullith) && <VermyrosUpgrades2 />}
          {(state.vermyros_5 || everPerformedNullith) && <Amplivault />}
        </>
      )}
      {state.bestSoftcapperLevel.greaterThanOrEqualTo(1) && <Softcapper />}
      {(state.vermyros_8 || everPerformedNullith) && (
        <>
          <EnergyReactors />
          <Energy />
          <CoreButton />
          {state.everMadeCoreReset && (
            <>
              <Cores />
              <CoreUpgrade />
            </>
          )}
          <VermyrosUpgrades3 />
        </>
      )}
      {(state.vermyros_10 || everPerformedNullith) && <DarkEnergy />}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer3;
