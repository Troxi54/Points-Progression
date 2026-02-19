import Menu from "@/ui/components/layouts/menus";
import { appStateSelector } from "./selector";
import NormalDimension from "./dimensions/normal";
import useGlobalEvents from "@/ui/hooks/useGlobalEvents";
import useDimensionScroll from "@/ui/hooks/useDimensionScroll";
import SliphDimension from "./dimensions/sliph";

function App() {
  useGlobalEvents();

  const appState = appStateSelector();
  useDimensionScroll({ dimensionId: appState.dimensionId });

  return (
    <>
      <Menu />
      <div className="size-full flex-col gap-20 pt-[calc(8vmin+1.5rem)] pb-12">
        <NormalDimension />
        <SliphDimension />
      </div>
    </>
  );
}

export default App;
