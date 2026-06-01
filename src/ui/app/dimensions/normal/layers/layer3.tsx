import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import Layer from "@ui/components/features/Layer";
import Amplivault from "@ui/components/game/buttons/Amplivault";
import CoreButton from "@ui/components/game/buttons/CoreButton";
import CoreUpgrade from "@ui/components/game/repeatableUpgrades/CoreUpgrade";
import VermyteUpgrade from "@ui/components/game/repeatableUpgrades/VermyteUpgrade";
import VermyrosBar from "@ui/components/game/resetLayers/VermyrosBar";
import Cores from "@ui/components/game/states/Cores";
import DarkEnergy from "@ui/components/game/states/DarkEnergy";
import Energy from "@ui/components/game/states/Energy";
import EnergyReactors from "@ui/components/game/states/EnergyReactors";
import Softcapper from "@ui/components/game/states/Softcapper";
import Vermora from "@ui/components/game/states/Vermora";
import Vermytes from "@ui/components/game/states/Vermytes";
import AutoVermyrosButton from "@ui/components/game/toggles/AutoVermyrosButton";
import VermyrosUpgrades from "@ui/components/game/upgrades/VermyrosUpgrades";
import VermyrosUpgrades2 from "@ui/components/game/upgrades/VermyrosUpgrades2";
import VermyrosUpgrades3 from "@ui/components/game/upgrades/VermyrosUpgrades3";
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
          nullith: [6],
        } as const);

        return mergeObjects(resetLayers, upgrades);
      },
    },
  );

  const everPerformedVermyros = state.resetLayer_vermyros_everPerformed;

  if (!(state.tier_4 || everPerformedVermyros)) return null;

  const everPerformedNullith = state.resetLayer_nullith_everPerformed;

  return (
    <Layer>
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
          {!state.nullith_6 && <CoreButton />}
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
    </Layer>
  );
}

export default NormalDimensionLayer3;
