import { createDynamicImport } from "@/ui/hooks/createDynamicImport";
import LoadingMenu from "@/ui/components/layouts/LoadingMenu";
import featureDependencies from "./dependencies";
import Menu from "@/ui/components/layouts/menus";
import { AppLayoutState, AppState } from "./types";
import { appStateSelector } from "./selector";
import NormalDimension from "./dimensions/normal";
import useGlobalEvents from "@/ui/hooks/useGlobalEvents";
import useDimensionScroll from "@/ui/hooks/useDimensionScroll";

const dynamic = createDynamicImport<AppState, typeof featureDependencies>(
  featureDependencies
);

function App() {
  useGlobalEvents();

  const appState = appStateSelector();
  useDimensionScroll({ dimensionId: appState.dimensionId });

  const { getComponent, firstComponentsLoaded } = dynamic(appState);

  const appLayoutState: AppLayoutState = {
    appState,
    getComponent
  };

  return (
    <LoadingMenu
      conditionForMainContent={firstComponentsLoaded}
      mainContent={
        <>
          <Menu />
          <div className="size-full flex-col gap-20 pt-[calc(8vmin+1.5rem)] pb-12">
            <NormalDimension appLayoutState={appLayoutState} />
            {getComponent("SliphDimension", { appLayoutState: appLayoutState })}
          </div>
        </>
      }
    />
  );
}

export default App;
