import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";

function NormalDimensionLayer3({ appLayoutState }: AppLayoutProps) {
  const { appState, getComponent } = appLayoutState;

  const everPerformedVermyros = appState.resetLayer_vermyros_everPerformed;

  if (!(appState.tier_4 || everPerformedVermyros)) return null;

  const everPerformedNullith = appState.resetLayer_nullith_everPerformed;

  return (
    <DimensionLayerLayout>
      {getComponent("VermyrosBar")}
      {everPerformedVermyros && (
        <>
          {!appState.vermyros_8 && getComponent("AutoVermyrosButton")}
          {getComponent("Vermora")}
          {getComponent("Vermytes")}
          {getComponent("VermyrosUpgrades")}
          {(appState.vermyros_1 || everPerformedNullith) &&
            getComponent("VermyteUpgrade")}
          {(appState.vermyros_4 || everPerformedNullith) &&
            getComponent("VermyrosUpgrades2")}
          {(appState.vermyros_5 || everPerformedNullith) &&
            getComponent("Amplivault")}
        </>
      )}
      {appState.bestSoftcapperLevel.greaterThanOrEqualTo(1) &&
        getComponent("Softcapper")}
      {(appState.vermyros_8 || everPerformedNullith) && (
        <>
          {getComponent("EnergyReactors")}
          {getComponent("Energy")}
          {getComponent("CoreButton")}
          {appState.everMadeCoreReset && (
            <>
              {getComponent("Cores")}
              {getComponent("CoreUpgrade")}
            </>
          )}
          {getComponent("VermyrosUpgrades3")}
        </>
      )}
      {(appState.vermyros_10 || everPerformedNullith) && (
        <>{getComponent("DarkEnergy")}</>
      )}
    </DimensionLayerLayout>
  );
}

export default NormalDimensionLayer3;
