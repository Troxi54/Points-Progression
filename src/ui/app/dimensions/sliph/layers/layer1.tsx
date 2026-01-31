import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import MallirtBar from "@/ui/components/progressBars/MallirtBar";
import DertointUpgrade from "@/ui/components/repeatableUpgrades/DertointUpgrade";
import Cappergy from "@/ui/components/states/Cappergy";
import Dertoints from "@/ui/components/states/Dertoints";
import SliphTimeSpent from "@/ui/components/states/SliphTimeSpent";
import AutoMallirtButton from "@/ui/components/toggles/AutoMallirtButton";
import DertointUpgrades from "@/ui/components/upgrades/DertointUpgrades";
import MallirtUpgrades from "@/ui/components/upgrades/MallirtUpgrades";

function SliphDimensionLayer1({ appLayoutState }: AppLayoutProps) {
  const { appState, getComponent } = appLayoutState;

  return (
    <DimensionLayerLayout>
      {getComponent("Sliph")}
      <SliphTimeSpent />
      <Dertoints />
      <DertointUpgrade />
      <DertointUpgrades />
      <MallirtBar />
      {appState.resetLayer_mallirt_everPerformed && (
        <>
          <AutoMallirtButton />
          <MallirtUpgrades />
        </>
      )}
      {appState.everReachedCappergy && <Cappergy />}
    </DimensionLayerLayout>
  );
}

export default SliphDimensionLayer1;
