import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import Layer from "@ui/components/features/Layer";
import Antinefit from "@ui/components/game/buttons/Antinefit";
import BreakAmplivault from "@ui/components/game/buttons/BreakAmplivault";
import Nexus from "@ui/components/game/buttons/Nexus";
import Nullifice from "@ui/components/game/buttons/Nullifice";
import Nuxar from "@ui/components/game/buttons/Nuxar";
import SliphToggle from "@ui/components/game/buttons/SliphToggle";
import BenefluxUpgrade from "@ui/components/game/repeatableUpgrades/BenefluxUpgrade";
import NullithUpgrade from "@ui/components/game/repeatableUpgrades/NullithUpgrade";
import NullithBar from "@ui/components/game/resetLayers/NullithBar";
import Beneflux from "@ui/components/game/states/Beneflux";
import AutoNullithButton from "@ui/components/game/toggles/AutoNullithButton";
import NullithUpgrades from "@ui/components/game/upgrades/NullithUpgrades";
import NullithUpgrades2 from "@ui/components/game/upgrades/NullithUpgrades2";
import NullithUpgrades3 from "@ui/components/game/upgrades/NullithUpgrades3";
import NullithUpgrades4 from "@ui/components/game/upgrades/NullithUpgrades4";
import NullithUpgrades5 from "@ui/components/game/upgrades/NullithUpgrades5";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function NormalDimensionLayer4() {
  const state = usePlayerFields(
    {
      player: ["everLeftAntinefit"],
    },
    {
      selector: (state) => {
        const resetLayers = everPerformedResetLayers(state, ["nullith"]);
        const upgrades = hasUpgrades(state, {
          vermyros: [10],
          nullith: [4, 5, 6, 8, 12],
        } as const);

        return mergeObjects(resetLayers, upgrades);
      },
    },
  );

  const everPerformedNullith = state.resetLayer_nullith_everPerformed;

  if (!(state.vermyros_10 || everPerformedNullith)) return null;

  const sliphCondition = everPerformedNullith && state.nullith_5;

  return (
    <Layer>
      <NullithBar />
      {everPerformedNullith && (
        <>
          {!state.nullith_5 && <AutoNullithButton />}
          <NullithUpgrades />
          {state.nullith_4 && (
            <>
              <Nullifice />
              <BreakAmplivault />
              <NullithUpgrades2 />
            </>
          )}
        </>
      )}
      {sliphCondition && <SliphToggle />}
      {everPerformedNullith && (
        <>
          {state.nullith_6 && (
            <>
              <Nuxar />
              <NullithUpgrades3 />
            </>
          )}
          {state.nullith_8 && (
            <>
              <Nexus />
              <NullithUpgrades4 />
            </>
          )}
          {state.nullith_12 && (
            <>
              <Antinefit />
              {state.everLeftAntinefit && (
                <>
                  <Beneflux />
                  <BenefluxUpgrade />
                  <NullithUpgrade />
                  <NullithUpgrades5 />
                </>
              )}
            </>
          )}
        </>
      )}
    </Layer>
  );
}

export default NormalDimensionLayer4;
