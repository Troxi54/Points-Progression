import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";

function NormalDimensionLayer4({ appLayoutState }: AppLayoutProps) {
  const { appState, getComponent } = appLayoutState;

  const everPerformedNullith = appState.resetLayer_nullith_everPerformed;

  if (!(appState.vermyros_10 || everPerformedNullith)) return null;

  const sliphCondition = everPerformedNullith && appState.nullith_5;

  return (
    <DimensionLayerLayout>
      {getComponent("NullithBar")}
      {everPerformedNullith && (
        <>
          {!appState.nullith_5 && getComponent("AutoNullithButton")}
          {getComponent("NullithUpgrades")}
          {appState.nullith_4 && (
            <>
              {getComponent("Nullifice")}
              {getComponent("BreakAmplivault")}
              {getComponent("NullithUpgrades2")}
            </>
          )}
        </>
      )}
      {sliphCondition && getComponent("Sliph")}
      {everPerformedNullith && (
        <>
          {appState.nullith_6 && (
            <>
              {getComponent("Nuxar")}
              {getComponent("NullithUpgrades3")}
            </>
          )}
          {appState.nullith_8 && (
            <>
              {getComponent("Nexus")}
              {getComponent("NullithUpgrades4")}
            </>
          )}
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer4;
