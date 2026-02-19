import Menu from "@/ui/components/layouts/menus";
import NormalDimension from "./dimensions/normal";
import useGlobalEvents from "@/ui/hooks/useGlobalEvents";
import useDimensionScroll from "@/ui/hooks/useDimensionScroll";
import SliphDimension from "./dimensions/sliph";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function App() {
  useGlobalEvents();

  const state = usePlayerFields({
    player: ["dimensionId"],
  });

  useDimensionScroll({ dimensionId: state.dimensionId });

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
