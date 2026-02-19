import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import TierBar from "@/ui/components/progressBars/TierBar";
import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import AmplifluxUpgrade from "@ui/components/repeatableUpgrades/AmplifluxUpgrade";
import Ampliflux from "@ui/components/states/Ampliflux";
import AutoTierButton from "@ui/components/toggles/AutoTierButton";
import TierUpgrades from "@ui/components/upgrades/TierUpgrades";
import TierUpgrades2 from "@ui/components/upgrades/TierUpgrades2";
import { usePlayer } from "@ui/hooks/usePlayer/main";

function NormalDimensionLayer2() {
  const state = usePlayer((state) => {
    const resetLayers = everPerformedResetLayers(state, [
      "reset",
      "tier",
      "vermyros",
    ]);
    const upgrades = hasUpgrades(state, {
      tier: [4],
      vermyros: [4],
    } as const);

    return mergeObjects(resetLayers, upgrades);
  });

  if (!state.resetLayer_reset_everPerformed) return null;

  return (
    <DimensionLayerLayout>
      <TierBar />
      {state.resetLayer_tier_everPerformed && (
        <>
          {!state.vermyros_4 && <AutoTierButton />}
          <TierUpgrades />
          {(state.tier_4 || state.resetLayer_vermyros_everPerformed) && (
            <>
              <Ampliflux />
              <AmplifluxUpgrade />
              <TierUpgrades2 />
            </>
          )}
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer2;
