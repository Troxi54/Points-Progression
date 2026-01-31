import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import TierBar from "@/ui/components/progressBars/TierBar";

function NormalDimensionLayer2({ appLayoutState }: AppLayoutProps) {
  const { appState, getComponent } = appLayoutState;

  if (!appState.resetLayer_reset_everPerformed) return null;

  return (
    <DimensionLayerLayout>
      <TierBar />
      {appState.resetLayer_tier_everPerformed && (
        <>
          {!appState.vermyros_4 && getComponent("AutoTierButton")}
          {getComponent("TierUpgrades")}
          {(appState.tier_4 || appState.resetLayer_vermyros_everPerformed) && (
            <>
              {getComponent("Ampliflux")}
              {getComponent("AmplifluxUpgrade")}
              {getComponent("TierUpgrades2")}
            </>
          )}
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer2;
