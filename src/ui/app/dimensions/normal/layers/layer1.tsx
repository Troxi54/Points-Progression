import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import ResetBar from "@/ui/components/progressBars/ResetBar";
import PointUpgrade from "@/ui/components/repeatableUpgrades/PointUpgrade";
import Points from "@/ui/components/states/Points";
import TimeSpent from "@/ui/components/states/TimeSpent";
import AutoResetButton from "@/ui/components/toggles/AutoResetButton";
import ResetUpgrades from "@/ui/components/upgrades/ResetUpgrades";

function NormalDimensionLayer1({ appLayoutState }: AppLayoutProps) {
  const { appState } = appLayoutState;

  return (
    <DimensionLayerLayout>
      <TimeSpent />
      <Points />
      <PointUpgrade />
      <ResetBar />
      {appState.resetLayer_reset_everPerformed && (
        <>
          {!appState.tier_4 && <AutoResetButton />}
          <ResetUpgrades />
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer1;
