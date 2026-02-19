import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import BreakAmplivault from "@ui/components/buttons/BreakAmplivault";
import Nexus from "@ui/components/buttons/Nexus";
import Nullifice from "@ui/components/buttons/Nullifice";
import Nuxar from "@ui/components/buttons/Nuxar";
import Sliph from "@ui/components/buttons/Sliph";
import NullithBar from "@ui/components/progressBars/NullithBar";
import AutoNullithButton from "@ui/components/toggles/AutoNullithButton";
import NullithUpgrades from "@ui/components/upgrades/NullithUpgrades";
import NullithUpgrades2 from "@ui/components/upgrades/NullithUpgrades2";
import NullithUpgrades3 from "@ui/components/upgrades/NullithUpgrades3";
import NullithUpgrades4 from "@ui/components/upgrades/NullithUpgrades4";
import { usePlayer } from "@ui/hooks/usePlayer/main";

function NormalDimensionLayer4() {
  const state = usePlayer((state) => {
    const resetLayers = everPerformedResetLayers(state, ["nullith"]);
    const upgrades = hasUpgrades(state, {
      vermyros: [10],
      nullith: [4, 5, 6, 8],
    } as const);

    return mergeObjects(resetLayers, upgrades);
  });

  const everPerformedNullith = state.resetLayer_nullith_everPerformed;

  if (!(state.vermyros_10 || everPerformedNullith)) return null;

  const sliphCondition = everPerformedNullith && state.nullith_5;

  return (
    <DimensionLayerLayout>
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
      {sliphCondition && <Sliph />}
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
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer4;
