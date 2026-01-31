import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";

function SliphDimensionLayer2({ appLayoutState }: AppLayoutProps) {
  const { appState, getComponent } = appLayoutState;

  if (!(appState.mallirt_4 || appState.resetLayer_level_everPerformed))
    return null;

  return (
    <DimensionLayerLayout>
      {getComponent("LevelBar")}
      {appState.resetLayer_level_everPerformed && (
        <>
          {getComponent("AutoLevelButton")}
          {getComponent("XPState")}
          {getComponent("LevelUpgrades")}
          {appState.level_4 && (
            <>
              {getComponent("Amplivoid")}
              {getComponent("AmplivoidUpgrade")}
              {getComponent("LevelUpgrades2")}
            </>
          )}
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default SliphDimensionLayer2;
